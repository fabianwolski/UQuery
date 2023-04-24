const initialPosts = [
  {
    id: 1,
    text: "The reverse() method of StringBuilder is used to reverse the characters in the StringBuilder. The method helps to this character sequence to be replaced by the reverse of the sequence. Syntax: public java.lang.AbstractStringBuilder reverse()",
    source:
      "https://www.geeksforgeeks.org/stringbuilder-class-in-java-with-examples/",
    category: "java",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "The original name for Java was said to be Oak, named by the Java legend",
    source:
      "https://www.besanttechnologies.com/15-unbelievable-facts-java#:~:text=The%20original%20name%20for%20Java,company%20with%20registered%20name%20Oak.",
    category: "java",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Go is an open-source, statically-typed compiled, and explicit programming language",
    source:
      "https://www.geeksforgeeks.org/interesting-facts-about-golang/#:~:text=Go%20is%20an%20open%2Dsource,paradigm%20and%20object%2Doriented%20language.",
    category: "go",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: "java", color: "#ff6961" },
  { name: "python", color: "#08cad1" },
  { name: "javascript", color: "#f8f38d" },
  { name: "c++", color: "#42d6a4" },
  { name: "sql", color: "#ffb480" },
  { name: "c#", color: "#59adf6" },
  { name: "html/css", color: "#9d94ff" },
  { name: "go", color: "#c780e8" },
];

//SELECTING DOM ELEMENTS
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".form");
const factsList = document.querySelector(".posts-list");

//CREATE DOM ELEMENTS
factsList.innerHTML = "";

//SUPABASE DATA
loadPosts();

async function loadPosts() {
  const res = await fetch(
    "https://zmshqsmmckzubglmrclg.supabase.co/rest/v1/Posts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc2hxc21tY2t6dWJnbG1yY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ5OTc5MzMsImV4cCI6MTk5MDU3MzkzM30.UaW4eEGHy7XMuzrHUN6RAjgEVmoguaGY7F4KGP0OK58",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc2hxc21tY2t6dWJnbG1yY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ5OTc5MzMsImV4cCI6MTk5MDU3MzkzM30.UaW4eEGHy7XMuzrHUN6RAjgEVmoguaGY7F4KGP0OK58",
      },
    }
  );
  const data = await res.json();
  console.log(data);
  //   const filteredData = data.filter((post) => post.category === "java");
  createPostsList(data);
}

function createPostsList(dataArray) {
  const htmlArr = dataArray.map(
    (post) => `<li class="post-content">
        <p>
        ${post.text} 
        <a
          class="source"
          href="${post.source}"
          target="_blank"
          >(Source)
        </a>
      </p>
      <span class="tag" style="background-color: ${
        CATEGORIES.find((cat) => cat.name === post.category)?.color
      }">${post.category}</span>
      </li>`
  );
  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

//VISIBILITY
btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share Wisdom";
  }
});
