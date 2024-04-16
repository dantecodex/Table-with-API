const columnList = ['brand', 'title', 'price', 'rating', 'stock'];
const showItem = [3, 6, 9, 12, 15];
const apiURL = 'https://dummyjson.com/products';
const productPerPage = 15;
let currentPage = 1;

boostrapTable();

document.addEventListener('DOMContentLoaded', () => {
    // Sort Product
    const sortList = document.querySelectorAll(".sort-Content li");
    sortList.forEach(list => {
        list.addEventListener("click", event => {
            searchProducts(event.target.textContent);
        });
    });

    // Show Hide Product
    const showProduct = document.querySelectorAll(".show-Content li");
    showProduct.forEach(content => {
        content.addEventListener("click", event => {
            let showProductNumber = event.target.textContent;
            const allProduct = document.querySelectorAll(".primary-table > tbody > tr");

            for (let index = 0; index < Number(showProductNumber); index++) {
                const element = allProduct[index];
                element.classList.remove("display-none");
            }
            for (let index = Number(showProductNumber); index < allProduct.length; index++) {
                const element = allProduct[index];
                element.classList.add("display-none");
            }
        })
    });

    // Page Navigation
    let totalPages = Math.ceil(getSetData().length / 15);
    let localData = getSetData();
    document.querySelector(".prevPage").addEventListener("click", event => {
        if (currentPage > 1) {
            currentPage--;
            drawTable(localData);
        }
    });
    document.querySelector(".nextPage").addEventListener("click", event => {
        if (currentPage < totalPages) {
            currentPage++
            drawTable(localData);
        }
    });

})


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
        searchProducts();
    });

    loadTable();
}

async function loadTable() {
    let products = await fetchAPI();
    drawTable(products);
}

function searchProducts(category) {
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
    if (!result.length && inputValue)
        result = [{
            "title": "NO DATA",
            "description": "NO DATA",
            "price": 'NO DATA',
            "rating": 'NO DATA',
            "stock": 'NO DATA',
            "brand": "NO DATA"
        }]

    drawTable(result);
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
    drawTable(result);
}


function drawTable(products) {
    const tableBody = document.querySelector(".primary-table tbody");
    let tableRows = ``;
    let startIndex = (currentPage - 1) * productPerPage;
    let lastIndex = startIndex + productPerPage;
    if (products.length > productPerPage) {
        for (let index = startIndex; index < lastIndex; index++) {
            let product = products[index]
            tableRows += `
            <tr>
            <td data-cell="brand">${product.brand}</td>
            <td data-cell="title">${product.title}</td>
            <td data-cell="description">${product.description}</td>
            <td data-cell="price">$${product.price}</td>
            <td data-cell="rating">${product.rating}</td>
            <td data-cell="stock">${product.stock}</td>
            </tr>
            `;
        }
    }
    else {
        for (const product of products) {
            tableRows += `
            <tr>
            <td data-cell="brand">${product.brand}</td>
            <td data-cell="title">${product.title}</td>
            <td data-cell="description">${product.description}</td>
            <td data-cell="price">$${product.price}</td>
            <td data-cell="rating">${product.rating}</td>
            <td data-cell="stock">${product.stock}</td>
            </tr>
            `;
        }
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