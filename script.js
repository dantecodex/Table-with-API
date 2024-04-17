const columnList = ['brand', 'title', 'price', 'rating', 'stock'];
const showItem = [3, 6, 9, 12, 15];
const apiURL = 'https://dummyjson.com/products';
const productPerPage = 5;
let currentPage = 1;

boostrapTable();

document.addEventListener('DOMContentLoaded', () => {
    const sortList = document.querySelectorAll(".sort-Content li");
    sortList.forEach(list => {
        list.addEventListener("click", event => {
            searchProducts(event.target.textContent);
        });
    });

    document.querySelector(".prevPage").addEventListener("click", event => {

        currentPage--;
        searchProducts();

    });
    document.querySelector(".nextPage").addEventListener("click", event => {

        currentPage++
        searchProducts();

    });

})

function paginate(result) {
    let totalProduct = result.length;
    let totalPages = totalProduct / productPerPage;

    let startIndex = (currentPage - 1) * productPerPage;
    let endIndex = startIndex + productPerPage;

    document.querySelector(".nextPage").style.display = "block";
    document.querySelector(".prevPage").style.display = "block";

    if (currentPage == totalPages) {
        document.querySelector(".nextPage").style.display = "none";

    }
    if (currentPage < 2) {
        document.querySelector(".prevPage").style.display = "none";

    }
    result = result.slice(startIndex, endIndex);
    drawTable(result);

}


function boostrapTable() {
    const sortContent = document.querySelector(".sort-Content");
    const showContent = document.querySelector(".show-Content");
    const inputBox = document.querySelector("#searchInput");

    let sortList = ``;
    let showList = ``;

    columnList.forEach(data => {
        sortList += `<li>${data}</li>`;
    })
    showItem.forEach(data => {
        showList += `<li>${data}</li>`;
    })

    sortContent.innerHTML = sortList;
    showContent.innerHTML = showList;

    inputBox.addEventListener("input", event => {
        currentPage = 1;
        searchProducts();
    });

    loadTable();
}

async function loadTable() {
    let products = await fetchAPI();
    paginate(products);
}

function searchProducts(category = null) {

    let inputValue = document.getElementById("searchInput").value;
    inputValue = inputValue.trim().toLowerCase();
    const localData = getSetData();
    let result = localData.filter(data => {
        if (!isNaN(Number(inputValue))) {
            const numInput = Number(inputValue);
            return numInput === data.price || numInput === data.stock ||
                numInput === data.rating;
        }
        else {
            return data.brand.toLowerCase().includes(inputValue) ||
                data.title.toLowerCase().includes(inputValue);
        }

    });
    if (!result.length && !inputValue)
        result = localData;



    sortContent(category, result);
}

function sortContent(category, result) {

    switch (category) {
        case 'brand':
        case 'title':
            result.sort((a, b) => a[category].localeCompare(b[category]));
            break;
        case 'price':
        case 'rating':
        case 'stock':
            result.sort((a, b) => a[category] - b[category]);
            break;
        default:

            break;
    }
    paginate(result);
}


function drawTable(products) {
    const tableBody = document.querySelector(".primary-table tbody");
    let tableRows = ``;

    products = products.length == 0 ? [{}] : products;
    for (const product of products) {
        tableRows += `
            <tr>
            <td data-cell="brand">${product.id ?? 'NO DATA'}</td>
            <td data-cell="brand">${product.brand ?? 'NO DATA'}</td>
            <td data-cell="title">${product.title ?? 'NO DATA'}</td>
            <td data-cell="description">${product.description ?? 'NO DATA'}</td>
            <td data-cell="price">${product.price ? '$ ' + product.price : 'NO DATA'}</td>
            <td data-cell="rating">${product.rating ?? 'NO DATA'}</td>
            <td data-cell="stock">${product.stock ?? 'NO DATA'}</td>
            </tr>
            `;
    }
    tableBody.innerHTML = tableRows;
}

async function fetchAPI() {
    let response = await fetch(apiURL);
    let data = await response.json();
    data = data.products;
    getSetData(data);
    return data;
}


function getSetData(data) {
    if (data)
        localStorage.setItem("apiData", JSON.stringify(data));
    else {
        let data = localStorage.getItem("apiData");
        return JSON.parse(data);
    }
}