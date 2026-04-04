from langchain_groq import ChatGroq
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv
import os

load_dotenv()

CHROMA_PATH = os.path.join(os.path.dirname(__file__), "../chroma_db")
KNOWLEDGE_PATH = os.path.join(os.path.dirname(__file__), "../knowledge_base")

def build_vector_db():
    docs = []
    for filename in os.listdir(KNOWLEDGE_PATH):
        filepath = os.path.join(KNOWLEDGE_PATH, filename)
        try:
            if filename.endswith(".txt"):
                loader = TextLoader(filepath, encoding="utf-8")
                docs.extend(loader.load())
            elif filename.endswith(".pdf"):
                loader = PyPDFLoader(filepath)
                docs.extend(loader.load())
        except Exception as e:
            print(f"Could not load {filename}: {e}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=60
    )
    chunks = splitter.split_documents(docs)
    print(f"Building vector DB with {len(chunks)} chunks...")

    embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY")
    )
    db = Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory=CHROMA_PATH
    )
    print("Vector DB built and saved successfully.")
    return db

def get_retriever():
    embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY")
    )
    if not os.path.exists(CHROMA_PATH):
        build_vector_db()
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )
    return db.as_retriever(search_kwargs={"k": 4})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def get_crop_advisory(crop_name: str, question: str = None) -> str:
    query = question or (
        f"Complete farming guide for {crop_name}: "
        f"soil preparation, NPK fertilizer schedule, "
        f"irrigation, pest control, harvest time and yield."
    )

    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.3
    )

    prompt = ChatPromptTemplate.from_template("""
You are an expert agricultural advisor for Indian farmers.
Use the following crop knowledge to answer the question.
Be specific, practical and concise. Use simple language.

Context:
{context}

Question: {question}

Answer:""")

    retriever = get_retriever()

    # Modern LangChain LCEL chain syntax
    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    result = chain.invoke(query)
    return result

if __name__ == "__main__":
    build_vector_db()
    print("\n--- Testing crop advisory ---")
    print(get_crop_advisory("rice"))