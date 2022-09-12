import InvoiceType, { AccountingSupplierParty, AccountingCustomerParty, DeliveryNoteReferences, InvoiceLines, TaxTotal, LegalMonetaryTotal, PaymentMeans, SellerSupplierParty, BuyerCustomerParty, Delivery } from './interface'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import validateSchema from 'xsd-validator'
import schema from './schema'
import InvoiceXMLError from './InvoiceXMLError'
import { randomUUID } from 'crypto'

const xmlopts = { attributeNamePrefix : '$_', ignoreAttributes : false, format: true }

export default class Invoice {
  public DocumentType :                             number = 1
  public SubDocumentType ?:                         string
  public SubDocumentTypeOrigin ?:                   string
  public TargetConsolidator ?:                      string
  public ClientOnTargetConsolidator ?:              string
  public ClientBankAccount ?:                       string
  public ID ?:                                      string
  public ID36 ?:                                    string
  public UUID ?:                                    string = randomUUID()
  public EgovFlag ?:                                boolean
  public ISDS_ID ?:                                 string
  public FileReference ?:                           string
  public ReferenceNumber ?:                         string
  public EgovClassifiers ?:                         any
  public IssuingSystem ?:                           string
  public IssueDate ?:                               string|Date
  public TaxPointDate ?:                            string|Date
  public VATApplicable ?:                           string
  public ElectronicPossibilityAgreementReference :  string = ''
  public Note ?:                                    string
  public LocalCurrencyCode :                        string = 'CZK'
  public ForeignCurrencyCode ?:                     string
  public CurrRate :                                 number|string = '1'
  public RefCurrRate :                              number|string = '1'
  public Extensions ?:                              any
  public AccountingSupplierParty ?:                 AccountingSupplierParty
  public SellerSupplierParty ?:                     SellerSupplierParty
  public AnonymousCustomerParty ?:                  any
  public AccountingCustomerParty ?:                 AccountingCustomerParty
  public BuyerCustomerParty ?:                      BuyerCustomerParty
  public OrderReferences ?:                         any
  public OriginalDocumentReferences ?:              any
  public ContractReferences ?:                      any
  public Delivery ?:                                Delivery
  public DeliveryNoteReferences ?:                  DeliveryNoteReferences
  public InvoiceLines ?:                            InvoiceLines
  public NonTaxedDeposits ?:                        any
  public TaxedDeposits ?:                           any
  public TaxTotal ?:                                TaxTotal
  public LegalMonetaryTotal ?:                      LegalMonetaryTotal
  public PaymentMeans ?:                            PaymentMeans
  public SupplementsList ?:                         any
  private $_xmlns = 'http://isdoc.cz/namespace/2013'
  private $_version = '6.0.1'

  constructor(data ?: InvoiceType|string|Buffer) {
    if (typeof data === 'string' || data instanceof Buffer) {
      const validation = validateSchema(data, schema)
      if (validation !== true)
        throw new InvoiceXMLError(validation)

      const parsed = new XMLParser(xmlopts).parse(data)
      if (parsed.Invoice)
        this.assign(parsed.Invoice, false)
      else
        throw new InvoiceXMLError()
    } else if (typeof data === 'object')
      this.assign(data)
  }

  assign(data : InvoiceType, validate : boolean = true) {
    if (typeof data.DocumentType === 'string')
      data.DocumentType = {
        'invoice': 1,
        'credit note': 2,
        'debit note': 3,
        'proforma invoice': 4,
        'advance invoice': 5,
        'advance credit note': 6,
        'simplified': 7
      }[data.DocumentType] as 1|2|3|4|5|6|7

    Object.assign(this, data)
    if (validate)
      this.validate()
  }

  validate(xml ?: string) : true {
    const validation = validateSchema(xml || this.toXML(), schema)
    if (validation !== true)
      throw new InvoiceXMLError(validation)
    return true
  }

  toXML(validate: boolean = true) : string {
    const data = {
      $_xmlns: this.$_xmlns,
      $_version: this.$_version,
      DocumentType: this.DocumentType,
      SubDocumentType: this.SubDocumentType,
      SubDocumentTypeOrigin: this.SubDocumentTypeOrigin,
      TargetConsolidator: this.TargetConsolidator,
      ClientOnTargetConsolidator: this.ClientOnTargetConsolidator,
      ClientBankAccount: this.ClientBankAccount,
      ID: this.ID,
      ID36: this.ID36,
      UUID: this.UUID,
      EgovFlag: this.EgovFlag,
      ISDS_ID: this.ISDS_ID,
      FileReference: this.FileReference,
      ReferenceNumber: this.ReferenceNumber,
      EgovClassifiers: this.EgovClassifiers,
      IssuingSystem: this.IssuingSystem,
      IssueDate: this.IssueDate,
      TaxPointDate: this.TaxPointDate,
      // LastValidDate: this.LastValidDate,
      VATApplicable: this.VATApplicable,
      ElectronicPossibilityAgreementReference: this.ElectronicPossibilityAgreementReference,
      Note: this.Note,
      LocalCurrencyCode: this.LocalCurrencyCode,
      ForeignCurrencyCode: this.ForeignCurrencyCode,
      CurrRate: this.CurrRate,
      RefCurrRate: this.RefCurrRate,
      Extensions: this.Extensions,
      AccountingSupplierParty: this.AccountingSupplierParty,
      SellerSupplierParty: this.SellerSupplierParty,
      AnonymousCustomerParty: this.AnonymousCustomerParty,
      AccountingCustomerParty: this.AccountingCustomerParty,
      BuyerCustomerParty: this.BuyerCustomerParty,
      OrderReferences: this.OrderReferences,
      DeliveryNoteReferences: this.DeliveryNoteReferences,
      OriginalDocumentReferences: this.OriginalDocumentReferences,
      ContractReferences: this.ContractReferences,
      Delivery: this.Delivery,
      InvoiceLines: this.InvoiceLines,
      NonTaxedDeposits: this.NonTaxedDeposits,
      TaxedDeposits: this.TaxedDeposits,
      TaxTotal: this.TaxTotal,
      LegalMonetaryTotal: this.LegalMonetaryTotal,
      PaymentMeans: this.PaymentMeans,
      SupplementsList: this.SupplementsList,
    }

    // noinspection JSUnusedGlobalSymbols
    const builderOptions = {
      ...xmlopts,
      tagValueProcessor: (name: string, value: any) : string => value instanceof Date
          ? value.toISOString().substring(0, 10)
          : value
    }

    const xml = `<?xml version='1.0' encoding='utf-8' ?>\n`
        + new XMLBuilder(builderOptions).build({ Invoice: data })
    if (validate)
      this.validate(xml)
    return xml
  }

  toJSON() : string {
    return JSON.stringify({ ...this }, null, 2)
  }
}

export { InvoiceType }
