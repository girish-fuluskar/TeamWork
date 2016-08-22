angular.module('app.services')

.factory('StorageServiceLocal', function($localStorage){
    /*$localStorage = $localStorage.default({
        storeData: []
    });*/

    var _getStorageAllData = function(){
        return $localStorage.things;
    };

    return {
        getStorageData: _getStorageAllData
    };
})

.factory('InvoiceService', ['$q', InvoiceService])


function InvoiceService($q) {  
    function createPdf(invoice) {
        return $q(function(resolve, reject) {
            var dd = createDocumentDefinition(invoice);
            var pdf = pdfMake.createPdf(dd).getBase64(function(encodedString) {
                data = encodedString;
            });

            /*pdf.getBase64(function (output) {
                resolve(base64ToUint8Array(output));
            });*/
        });
    }

    return {
        createPdf: createPdf
    };    
} 

function base64ToUint8Array(base64) {  
    var raw = atob(base64);
    var uint8Array = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
}

function createDocumentDefinition(invoice) {
    /*var data = $localStorage;
    console.log(data);

    var _getAll = function () {
      return $localStorage.storageData;
    };*/
    /*var items = invoice.Items.map(function(item) {
        return [item.Description, item.Quantity, item.Price];
    });*/

    var itemsArray = [];
    itemsArray.push(invoice);
    var items = itemsArray.map(function(item){
        return [item.Date];
    });

    var dd = {
        content: [
            { text: 'TEAM WORK', style: 'header', alignment: 'center'},
            { text: 'Flat No. 903, Guru Niwas Building, Near Wester Express Highway, Jijamata Marg, Pump House, Andheri(E), Mumbai  400093, Tel : 2683 4151 | Email : teamwork.kumar@gmail.com', alignment: 'center'},
            { text: ' '},
            { text: ' '},
            { text: invoice.Date, alignment: 'right'},
            { text: 'To', style: 'subheader'},
            { text: 'M/S :' + "   " + invoice.Ms.Ms, style: 'subheader'},
            { text: 'Pan Card No : ADWPR2292Q', alignment: 'right'},
            { text: 'Service Tax No : ADWPR2292QST001', alignment: 'right'},
            {text: ' '},
            { text: 'Particulars', style: 'subheader'},
            {
                style: 'itemsTable',
                table: {
                    widths: ['*', 75, 75],
                    body: [
                        [ 
                            { text: 'Description', style: 'itemsTableHeader' },
                            { text: 'Quantity', style: 'itemsTableHeader' },
                            { text: 'Price', style: 'itemsTableHeader' },
                        ]
                    ].concat(items)
                }
            },
            {
                style: 'totalsTable',
                table: {
                    widths: ['*', 75, 75],
                    body: [
                        [
                            '',
                            'Subtotal',
                            invoice.Subtotal,
                        ],
                        [
                            '',
                            'Shipping',
                            invoice.Shipping,
                        ],
                        [
                            '',
                            'Total',
                            invoice.Total,
                        ]
                    ]
                },
                layout: 'noBorders'
            },
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment: 'right'
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 20, 0, 5]
            },
            itemsTable: {
                margin: [0, 5, 0, 15]
            },
            itemsTableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            totalsTable: {
                bold: true,
                margin: [0, 30, 0, 0]
            }
        },
        defaultStyle: {
        }
    }

    return dd;
}
