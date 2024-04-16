const columnList = ["brand", 'title', 'description', 'price', 'rating'];
const showItem = [3, 6, 9, 12, 15];
const apiURL = 'https://dummyjson.com/products';

boostrapTable();
function boostrapTable() {
    const sortContent = document.querySelector(".sort-Content");
    const showContent = document.querySelector(".show-Content");
    

    let sortList = ``;
    let showList = ``;

    columnList.forEach(data => {
        sortList += `<li onclick="sortProducts('${data}')">${data}</li>`;

    })
    showItem.forEach(data => {
        showList += `<li>${data}</li>`;

    })

    sortContent.innerHTML = sortList;
    showContent.innerHTML = showList;

    
    document.querySelector("#searchInput")
    .addEventListener("input",event=> {
        
        searchProducts();
       
    });

    loadTadble();
}

async function loadTadble() {
    let products = await fetchAPI();
    
    drawTable(products);
}

function searchProducts() {
    let inputValue = document.getElementById("searchInput").value;
    let localData = getSetData();
    inputValue.trim().toLowerCase();
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
    console.log(result);
    if(!result.length)
    {
        result = localData;
    }
    drawTable(result);
    
}

function drawTable(products) {

    const tableBody = document.querySelector(".primary-table tbody");
    let tableRows = ``;
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
    if(data)
        localStorage.setItem("apiData",JSON.stringify(data));
    else   
        {
           let data = localStorage.getItem("apiData");  
           return JSON.parse(data);
        } 
}