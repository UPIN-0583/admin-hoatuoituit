import { BASE_URL } from "../services/api"; // hoặc đường dẫn đúng tùy project

export default function BlogPreview({ post, onClose }) {
  if (!post) return null;

  const sanitizedContent = post.content
    .replaceAll("http://localhost:8080", BASE_URL);

  const thumbnailSrc = `${BASE_URL}${post.thumbnailUrl}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl mx-auto rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="p-6">
          <img
            src={thumbnailSrc}
            alt="Ảnh đại diện"
            className="w-full h-64 object-cover rounded-md mb-6"
          />

          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            Tác giả: {post.author} • {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <article className="prose max-w-none prose-img:rounded prose-img:shadow prose-img:mx-auto prose-h1:text-3xl prose-h2:text-2xl prose-p:leading-relaxed prose-a:text-blue-600">
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </article>
        </div>
      </div>
    </div>
  );
}
