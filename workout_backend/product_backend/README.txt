ENDPOINTS:
    GET;    /products
            /products/:flavour  (/products/Raspberry)
            /products/All
    POST;
            /products
                ** JSON TEXT
                    {"flavour": "Orange",
                    "type": "Protein-powder",
                    "price": "65.99"}
                ** JSON TEXT
    PUT;        
            /products
                ** JSON TEXT
                    {"flavour": "Orange",
                    "type": "Protein-powder",
                    "price": "65.99",
                    "updatePrice": "1.00"}
                ** JSON TEXT
    DELETE;     
            /products
                ** JSON TEXT
                    {"flavour": "Orange"}
                ** JSON TEXT