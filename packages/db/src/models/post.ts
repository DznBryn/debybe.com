import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { connectDb } from '../client';

export type PostStatus = 'draft' | 'published';

const postSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
    coverImage: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    readingMinutes: { type: Number, default: 1 },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

postSchema.index({ status: 1, publishedAt: -1 });

export type PostDocument = InferSchemaType<typeof postSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  status: PostStatus;
  readingMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PostListItem = Omit<Post, 'content'>;

export const PostModel: Model<PostDocument> =
  (mongoose.models.Post as Model<PostDocument>) ||
  mongoose.model<PostDocument>('Post', postSchema);

function serialize(doc: PostDocument): Post {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    tags: doc.tags ?? [],
    coverImage: doc.coverImage ?? undefined,
    status: doc.status as PostStatus,
    readingMinutes: doc.readingMinutes ?? 1,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

function serializeListItem(doc: PostDocument): PostListItem {
  const { content: _content, ...rest } = serialize(doc);
  return rest;
}

function hasDbConfig(): boolean {
  return typeof process.env.MONGODB_URI === 'string' && process.env.MONGODB_URI.length > 0;
}

export async function getPublishedPosts(limit = 50): Promise<PostListItem[]> {
  if (!hasDbConfig()) return [];
  await connectDb();
  const docs = await PostModel.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<PostDocument[]>({ virtuals: false });
  return docs.map((d) => serializeListItem(d as PostDocument));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!hasDbConfig()) return null;
  await connectDb();
  const doc = await PostModel.findOne({ slug, status: 'published' }).lean<PostDocument | null>();
  return doc ? serialize(doc as PostDocument) : null;
}

export async function getPostsByTag(tag: string, limit = 50): Promise<PostListItem[]> {
  if (!hasDbConfig()) return [];
  await connectDb();
  const docs = await PostModel.find({ status: 'published', tags: tag })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<PostDocument[]>();
  return docs.map((d) => serializeListItem(d as PostDocument));
}

export async function getAllTags(): Promise<string[]> {
  if (!hasDbConfig()) return [];
  await connectDb();
  const tags = await PostModel.distinct('tags', { status: 'published' });
  return (tags as string[]).sort();
}
