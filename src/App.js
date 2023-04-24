import './styles.css';
import { useEffect, useState } from 'react';
import supabase from './supabase';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(
    function () {
      async function getPosts() {
        let query = supabase.from('Posts').select('*');
        if (currentCategory !== 'all') {
          query = query.eq('category', currentCategory);
        }
        const { data: Posts, error } = await query
          .order('voteslike', { ascending: false })

          .limit(1000);

        if (!error) setPosts(Posts);
        else alert('There was a problem getting data');
      }
      getPosts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* state variable */}
      {showForm ? (
        <NewPostForm setPosts={setPosts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        <PostList posts={posts} setPosts={setPosts} />
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img
          src="letter-u-svgrepo-com.svg"
          alt="logo"
          width="68px"
          height="68px"
        />
        <h1>Query</h1>
        <p className="quote">"An Answer for 'U' and 'U'r Queries"</p>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? 'Close' : 'Share Wisdom'}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: 'java', color: '#ff6961' },
  { name: 'python', color: '#ffb480' },
  { name: 'javascript', color: '#f8f38d' },
  { name: 'c++', color: '#42d6a4' },
  { name: 'sql', color: '#08cad1' },
  { name: 'c#', color: '#59adf6' },
  { name: 'html/css', color: '#9d94ff' },
  { name: 'go', color: '#c780e8' },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}
console.log('http://example.com: ' + isValidHttpUrl('https://example.com'));
console.log('example.com: ' + isValidHttpUrl('example.com'));

function NewPostForm({ setPosts, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsuploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    //1. Stop reload
    e.preventDefault();
    console.log(text, source, category);
    //2.valid data? then create post
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //ignore!
      //create fact obj
      // const newPost = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      //uploading to database and receive new
      setIsuploading(true);
      const { data: newPost, error } = await supabase
        .from('Posts')
        .insert([{ text, source, category }])
        .select();
      setIsuploading(false);

      //console.log(newPost);
      //add it to state
      if (!error) setPosts((posts) => [newPost[0], ...posts]);
      //finally set empty fields
      setText('');
      setSource('');
      setCategory('');
      //and close form
      setShowForm(false);
    }
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share your programming knowledge..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source"
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory('all')}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PostList({ posts, setPosts }) {
  if (posts.length === 0)
    return (
      <p className="quick">
        No posts for this categroy yet! Create the first one. ✌️
      </p>
    );

  return (
    <section>
      <ul className="posts-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} setPosts={setPosts} />
        ))}
      </ul>
      <p>There are {posts.length} posts in the homepage. Add your own!</p>
    </section>
  );
}

function Post({ post, setPosts }) {
  const [userVote, setUserVote] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVote(columnName) {
    if (userVote) {
      alert('You can only vote once per post.');
      return;
    }

    setIsUpdating(true);
    const { data: updatedPost, error } = await supabase
      .from('Posts')
      .update({ [columnName]: post[columnName] + 1 })
      .eq('id', post.id)
      .select();
    setIsUpdating(false);

    if (!error) {
      setUserVote(columnName);
      setPosts((posts) =>
        posts.map((p) => (p.id === post.id ? updatedPost[0] : p))
      );
    } else {
      console.error('Error while updating post:', error);
    }
  }

  function isDisputed() {
    return post.votesfalse > post.voteslike + post.votesmindblowing;
  }

  return (
    <li className="post-content">
      <p>
        {isDisputed() && <span className="disputed-tag">Disputed</span>}
        {post.text}
        {isDisputed() && <span className="disputed-tag">Disputed</span>}
        <a
          className="source"
          href={post.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === post.category)
            ?.color,
        }}
      >
        {post.category}
      </span>
      <div className="post-buttons">
        <button
          onClick={() => handleVote('voteslike')}
          disabled={isUpdating || userVote}
        >
          👍 {post.voteslike}
        </button>
        <button
          onClick={() => handleVote('votesmindblowing')}
          disabled={isUpdating || userVote}
        >
          🤯 {post.votesmindblowing}
        </button>
        <button
          onClick={() => handleVote('votesfalse')}
          disabled={isUpdating || userVote}
        >
          ⛔️ {post.votesfalse}
        </button>
      </div>
    </li>
  );
}

export default App;
