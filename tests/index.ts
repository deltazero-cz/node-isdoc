import Invoice from '../lib'
import validateSchema from 'xsd-validator'
import schema from '../lib/schema'
import { expect } from 'chai'
import { readFileSync } from 'fs'

const file = readFileSync(__dirname + '/invoice.isdoc', "utf-8")

describe('Create an Invoice', () => {
  it('Is Valid', () => {
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
          PartyIdentification: { ID: '0123456789' },
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

    expect(invoice).to.have.property('TaxPointDate')
    expect(invoice?.LegalMonetaryTotal?.PayableAmount).to.be.eq(121)

    const inv2 = new Invoice(invoice.toXML(true))
    expect(typeof inv2.AccountingSupplierParty?.Party.PartyIdentification?.ID).to.be.eq('string')
    expect(inv2.AccountingSupplierParty?.Party.PartyIdentification?.ID).to.be.eq('0123456789')
  })
})

describe('Valid File', () => {
  let invoice = new Invoice(file)

  it ('Load Valid File', () => {
    expect(invoice.DocumentType).to.be.oneOf([1,2,3,4,6,7])
  })

  it ('Loaded data Validates', () => {
    expect(invoice.validate()).to.be.true
  })

  it ('Export to JSON', () => {
    const json = invoice.toJSON()
    // console.log(json)
    expect(typeof json).to.be.eq('string')
    expect(json[0]).to.be.eq('{')
    expect(JSON.parse(json).DocumentType).to.be.a('number')
  })

  it ('Export to XML + validation', () => {
    const xml = invoice.toXML()
    // console.log(xml)
    expect(typeof xml).to.be.eq('string')
    expect(xml[0]).to.be.eq('<')
    expect(validateSchema(xml, schema)).to.be.true
  })
})

describe('Invalid File', () => {
  it ('Loading an Invalid File Throws', () => {
    expect(function() {
      new Invoice(file.replace('<DocumentType>1</DocumentType>', '<DocumentType>A</DocumentType>'))
    }).throws('Invalid Invoice')
  })
})
