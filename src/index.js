const axios = require('axios').default;

class Product {
    constructor(){
        this.name = document.getElementById('txtName');
        this.brand = document.getElementById('txtBrand');
        this.quantity = document.getElementById('txtQtd');
        this.perishable = document.getElementById('perishable');
        this.btnInsertProduct = document.getElementById('btnInsertProduct');
        this.btnUpdateProduct = document.getElementById('btnUpdateProduct');
        this.id = 0;

        this.getProducts();
        this.events();
    }

    events() {
        this.btnInsertProduct.onclick = (event) => this.validateProduct(event);
        this.btnUpdateProduct.onclick = (event) => this.updateProduct(this.id);
    }
    
    recoveryProducts(data) {
        for(products of data) {
            const html = this.layoutProduct(products.name, products.brand, products.quantity, products.perishable, products.id);
            this.insertHtmlProduct(html);
        }

        document.querySelectorAll('.getProduct').forEach(editBtn => {
            editBtn.onclick = event => this.getProduct(editBtn.id);
        })

        document.querySelectorAll('.deleteProduct').forEach(deleteBtn => {
            deleteBtn.onclick = event => this.deleteProduct(deleteBtn.id);
        })
        
    }

    getProducts(){
        axios.get('http://localhost:3000/products')
        .then((result) => {
            this.recoveryProducts(result.data.products);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getProduct(id){
        axios.get(`http://localhost:3000/products/${id}`)
        .then((response) => {
            this.id = id;
            document.getElementById('txtNameModal').value = response.data.products[0].name;
            document.getElementById('txtBrandModal').value = response.data.products[0].brand;
            document.getElementById('txtQtdModal').value = response.data.products[0].quantity;
            document.getElementById('perishableModal').checked = response.data.products[0].perishable;
        })
        .catch((error) => {
            console.log(error);
        })
    }

    layoutProduct(name, brand, quantity, perishable, id) {
        let perishableOption = ['Sim', 'Não'];
        
        if(perishable === true) {
            perishable = perishableOption[0];
        } else {
            perishable = perishableOption[1];
        }

        return `
            <div class="products">
                <div class="border border-dark rounded card mb-3">
                    <ul class="list-group list-group-flush">
                        <div class="card-header"> Produto: ${name}</div>
                        <li class="list-group-item">Marca: ${brand}</li>
                        <li class="list-group-item">Quantidade: ${quantity}</li>
                        <li class="list-group-item">Perecível: <span class="text-danger">${perishable} </span></li>
                        <button type="button" class="btn btn-outline-danger deleteProduct" id="${id}">Excluir</button>
                        <button type="button" class="btn btn-outline-success getProduct" id="${id}" data-toggle="modal" data-target="#modalProduct">Editar</button>
                    </ul>
                </div>
            </div>
        `; 
     }

     validateProduct(event) {
        event.preventDefault();
        if(this.name.value && this.brand.value && this.quantity.value) {
            const products = {
                name: this.name.value,
                brand: this.brand.value,
                quantity: this.quantity.value,
                perishable: this.perishable.checked
            } 
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Produto adicionado ao estoque!',
                showConfirmButton: false,
                timer: 2500
            })
            
            this.createProduct(products);

        } else {
            Swal.fire('Preencha todas as informações!')
        }
    }

    insertHtmlProduct(html){
        document.getElementById('productBoard').innerHTML += html;
    }

    createProduct(products) {
        axios.post('http://localhost:3000/products', products)
        .then((result) => {
            const html = this.layoutProduct(products.name, products.brand, products.quantity, products.perishable);
            this.insertHtmlProduct(html);
            let reloadPage = setTimeout(function() {
                window.location.reload();
            }, 1000)  
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteProduct(id) {
        axios.delete(`http://localhost:3000/products/${id}`)
        .then((result) => {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: 'Produto excluído do estoque!',
                showConfirmButton: false,
                timer: 2500
            })
            let reloadPage = setTimeout(function() {
                window.location.reload();
            }, 2000)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    updateProduct(id) {
        let editProduct = {
            name: document.getElementById('txtNameModal').value,
            brand: document.getElementById('txtBrandModal').value,
            quantity: document.getElementById('txtQtdModal').value,
            perishable: document.getElementById('perishableModal').checked
        }
        axios.put(`http://localhost:3000/products/${id}`, editProduct)
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

new Product();