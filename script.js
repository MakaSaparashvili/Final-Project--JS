// ჰედერი და ფუთერი სტატიკური ყველა გვერძე
function loadComp(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}
loadComp('main-header', 'header.html');
loadComp('main-footer', 'footer.html');

// ფიქსირებული ჰედერი სქროლვის დროს
function handleScroll() {
  const header = document.querySelector('.upper-header');
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleScroll);

// პროდუქტების გვერდი
const productsContainer = document.getElementById("product-container");
const paginationContainer = document.getElementById("pagination");
const productsPerPage = 6;
let allProducts = [];
let currentPage = 1;


async function fetchProducts() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    allProducts = data;
    renderProducts(currentPage);
    renderPagination();
  } catch (error) {
    if (productsContainer) {
      productsContainer.innerHTML = `<div class="alert alert-danger">404 Error!</div>`;
    }
    console.error("Product load error:", error);
  }
}


function renderProducts(page) {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  currentProducts.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('col');
    card.innerHTML = `
  <a href="product.html?id=${product.id}" class="text-decoration-none text-dark">
    <div class="card h-100">
      <img src="${product.imageUrl}" alt="${product.Title}" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${product.Title}</h5>
        <p class="card-text">${product.shortdescription}</p>
        <p class="card-text fw-bold">$${product.price}</p>
      </div>
      <div class="card-footer">
        <small class="text-muted">${product.category}</small>
      </div>
    </div>
  </a>
`;
    productsContainer.appendChild(card);
  });
}

// pagination ღილაკები
function renderPagination() {
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const listItem = document.createElement('li');
    listItem.classList.add("page-item");
    if (i === currentPage) listItem.classList.add('active');

    const link = document.createElement("a");
    link.classList.add("page-link");
    link.href = "#";
    link.textContent = i;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderProducts(currentPage);

      const activeItem = paginationContainer.querySelector(".page-item.active");
      if (activeItem) activeItem.classList.remove("active");
      listItem.classList.add("active");

      document.getElementById("product-container").scrollIntoView({
        behavior: "smooth"
      });
    });

    listItem.appendChild(link);
    paginationContainer.appendChild(listItem);
  }
}

// PRODUCT.HTML – პროდუქტის დეტალების ჩატვირთვა
async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    document.querySelector("main").innerHTML = "<h2>Invalid product ID</h2>";
    return;
  }

  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const product = data.find(p => p.id === Number(productId));

    if (product) {
      document.getElementById("product-image").src = product.imageUrl;
      document.getElementById("product-image").alt = product.Title;
      document.getElementById("product-title").textContent = product.Title;
      document.getElementById("product-description").textContent = product.shortdescription;
      document.getElementById("product-price").textContent = `$${product.price}`;
    } else {
      document.querySelector("main").innerHTML = "<h2>Product not found</h2>";
    }
  } catch (err) {
    console.error("Error loading product:", err);
    document.querySelector("main").innerHTML = "<h2>Error loading product</h2>";
  }
}

// ფუნქციამ მხოლოდ შესაბამის გვერძე რომ იმუშაოს
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  fetchProducts();
}

if (window.location.pathname.includes("product.html")) {
  loadProductDetails();
}

// აქამდე სწორიააა!!





