#!/usr/bin/env python3
"""
upload_qa.py — Upload .qa.md files directly to ChromaDB using Gemini embeddings
Usage:
  python3 upload_qa.py <path-to-file.qa.md>
  python3 upload_qa.py knowledge-base/lifeos/vectors/arch/lifeos-arch-001.qa.md
"""

import sys, os, re
import chromadb
from google import genai

CHROMA_HOST = "localhost"
CHROMA_PORT = 8000
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_2", "AIzaSyB13GQVLv7dhtQDsta6XZx_aDE41RhhMq4")
EMBEDDING_MODEL = "models/gemini-embedding-001"

gemini = genai.Client(api_key=GEMINI_API_KEY)
chroma = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)

def parse_qa_file(filepath):
    with open(filepath) as f:
        raw = f.read().strip()

    # Split all sections by \n---\n
    sections = [s.strip() for s in re.split(r'\n---\n|^---\n', raw, flags=re.MULTILINE) if s.strip()]

    metadata = {
        "project": "unknown",
        "category": "arch",
        "source": "manual",
        "source_file": filepath,
        "created": "unknown"
    }

    qa_sections = sections
    # First section = frontmatter if it has no Q: / A:
    if sections and 'Q:' not in sections[0]:
        for line in sections[0].split('\n'):
            if ':' in line and not line.startswith('Q:'):
                key, _, val = line.partition(':')
                metadata[key.strip()] = val.strip()
        qa_sections = sections[1:]

    pairs = [{"text": s, "metadata": dict(metadata)}
             for s in qa_sections if 'Q:' in s and 'A:' in s]
    return pairs, metadata

def embed(text):
    r = gemini.models.embed_content(model=EMBEDDING_MODEL, contents=text)
    return r.embeddings[0].values

def upload_file(filepath):
    pairs, meta = parse_qa_file(filepath)
    col_name = f"{meta.get('project', 'unknown')}-qa"

    collection = chroma.get_or_create_collection(col_name, metadata={"hnsw:space": "cosine"})
    print(f"📁 {filepath}")
    print(f"📦 Collection: {col_name} | Pairs: {len(pairs)}")

    base_id = meta.get('id', os.path.splitext(os.path.basename(filepath))[0])
    ids, embeddings, docs, metas = [], [], [], []
    for i, pair in enumerate(pairs):
        ids.append(f"{base_id}-{i}")
        embeddings.append(embed(pair['text']))
        docs.append(pair['text'])
        metas.append(pair['metadata'])
        print(f"  ✅ {i+1}/{len(pairs)} embedded")

    if ids:
        collection.upsert(ids=ids, embeddings=embeddings, documents=docs, metadatas=metas)
        print(f"\n✅ Uploaded {len(ids)} vectors → '{col_name}' (total: {collection.count()})")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 upload_qa.py <file.qa.md>")
        sys.exit(1)
    fp = sys.argv[1]
    if not os.path.exists(fp):
        print(f"❌ Not found: {fp}")
        sys.exit(1)
    upload_file(fp)
