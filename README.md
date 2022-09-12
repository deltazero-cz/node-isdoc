# ISDOC Node.js library

[ISDOC](https://isdoc.github.io/) is an XML Invoicing Standard for the Czech Republic

This library provides Node.js API for parsing, modifying or creating
ISDOC invoices. It validates ISDOC invoices agains
[XSD definition](https://isdoc.github.io/xsd/isdoc-invoice-dsig-6.0.2.xsd). 
It also provides **partial support** for typescript definitions for ISDOC invoices.

Currently supported ISDOC version is 6.0.2.  
Default version of created invoices is downgraded to 6.0.1, due to the
lack of support for current version by the official [ISDOC Reader](https://www.isdoc.org/).

For parsing ISDOC from or attaching it to a PDF, see
[isdoc-pdf](https://github.com/deltazero-cz/node-isdoc-pdf).

### Installation

```shell
npm i @deltazero/isdoc
```

### Usage

Parsing existing invoice files
```js
import Invoice from 'isdoc'

const file = await fs.readFile('invoice.isdoc')
const invoice = new Invoice(file) // Buffer|string

invoice.toXML()
// string <Invoice xmlns="http://isdoc.cz/namespace/2013" version="6.0.1"><DocumentType>1</DocumentType>...</Invoice>

invoice.toJSON()
// string { "DocumentType": 1, "ID": "2022123456", IssueDate: "2022-09-11", ... }

console.log(invoice)
// Invoice { DocumentType: number, ID: string, IssueDate: Date, ... }

console.log(invoice.LegalMonetaryTotal.PayableAmount)
// number 121
```

Creating new invoices
```js
import Invoice from 'isdoc'

const invoice = new Invoice({
  DocumentType: 1,
    // 1 | 'invoice'                Faktura - daňový doklad
    // 2 | 'credit note'            Opravný daňový doklad (dobropis)
    // 3 | 'debit note'             Opravný daňový doklad (vrubopis)
    // 4 | 'proforma invoice'       Zálohová faktura (nedaňový zálohový list)
    // 5 | 'advance invoice'        Daňový doklad při přijetí platby (daňový zálohový list)
    // 6 | 'advance credit note'    Opravný daňový doklad při přijetí platby (dobropis DZL)
    // 7 | 'simplified'             Zjednodušený daňový doklad
  ID: '2022123456',
  IssuingSystem: 'node-isdoc',
  IssueDate: new Date(),
  TaxPointDate: new Date(),
  VATApplicable: true,
  AccountingSupplierParty: {
    Party: {
      PartyIdentification: { ID: '12345678' },
      PartyName: { Name: 'Test s.r.o.' },
      PostalAddress: {
        StreetName: 'Dodavatelská',
        BuildingNumber: '1',
        CityName: 'Dodavatelov',
        PostalZone: '12345',
        Country: { IdentificationCode: 'CZ', Name: '' }
      },
      PartyTaxScheme: {
        CompanyID: 'CZ12345678',
        TaxScheme: 'VAT'
      },
      Contact: {
        Telephone: '222111000',
        ElectronicMail: 'dodavatel@posta.cz'
      }
    }
  },
  AccountingCustomerParty: {
    Party: {
      PartyIdentification: { ID: '12345678' },
      PartyName: { Name: 'Test s.r.o.' },
      PostalAddress: {
        StreetName: 'Dodavatelská',
        BuildingNumber: '1',
        CityName: 'Dodavatelov',
        PostalZone: '12345',
        Country: { IdentificationCode: 'CZ', Name: '' }
      },
      PartyTaxScheme: {
        CompanyID: 'CZ12345678',
        TaxScheme: 'VAT'
      },
      Contact: {
        Telephone: '222111000',
        ElectronicMail: 'dodavatel@posta.cz'
      }
    }
  },
  InvoiceLines: {
    InvoiceLine: [
      {
        ID: '10001',
        InvoicedQuantity: 1,
        LineExtensionAmount: 100,
        LineExtensionAmountTaxInclusive: 121,
        LineExtensionTaxAmount: 21,
        UnitPrice: 100,
        UnitPriceTaxInclusive: 121,
        ClassifiedTaxCategory: { 
            Percent: 21, 
            VATCalculationMethod: 0, 
            VATApplicable: true 
        },
        Item: { Description: 'Zboží 10001' }
      },
    ]
  },
  TaxTotal: {
    TaxSubTotal: {
      TaxableAmount: 100,
      TaxAmount: 21,
      TaxInclusiveAmount: 121,
      AlreadyClaimedTaxableAmount: 0,
      AlreadyClaimedTaxAmount: 0,
      AlreadyClaimedTaxInclusiveAmount: 0,
      DifferenceTaxableAmount: 100,
      DifferenceTaxAmount: 21,
      DifferenceTaxInclusiveAmount: 121,
      TaxCategory: {
        Percent: 21,
        VATApplicable: true,
      }
    },
    TaxAmount: 21
  },
  LegalMonetaryTotal: {
    TaxExclusiveAmount: 100,
    TaxInclusiveAmount: 121,
    AlreadyClaimedTaxExclusiveAmount: 0,
    AlreadyClaimedTaxInclusiveAmount: 0,
    DifferenceTaxExclusiveAmount: 100,
    DifferenceTaxInclusiveAmount: 121,
    PayableRoundingAmount: 0,
    PaidDepositsAmount: 0,
    PayableAmount: 121
  },
  PaymentMeans: {
    Payment: {
      PaidAmount: 121,
      PaymentMeansCode: 42,
      Details: {
        PaymentDueDate: new Date(),
        ID: '43-1234567890',
        BankCode: '0100',
        Name: '',
        IBAN: '',
        BIC: '',
        VariableSymbol: 2022123456,
        ConstantSymbol: '',
        SpecificSymbol: ''
      }
    }
  }
})

invoice.toXML()
// string <Invoice xmlns="http://isdoc.cz/namespace/2013" version="6.0.1"><DocumentType>1</DocumentType>...</Invoice>
```
