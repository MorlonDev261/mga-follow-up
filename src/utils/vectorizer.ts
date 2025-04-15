import db from '@/lib/db';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';

export async function getSimilarContext(query: string): Promise<string> {
  const data = await db.assistantContext.findMany();

  const docs = data.map(d =>
    new Document({
      pageContent: `Q: ${d.question}\nR: ${d.answer}`,
      metadata: { id: d.id }
    })
  );

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
  const splitDocs = await splitter.splitDocuments(docs);

  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new OpenAIEmbeddings());

  const results = await vectorStore.similaritySearch(query, 3);

  return results.map(doc => doc.pageContent).join("\n");
}
