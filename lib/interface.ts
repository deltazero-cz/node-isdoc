export default interface InvoiceType {
  DocumentType ?:
      1|'invoice'|
      2|'credit note'|
      3|'debit note'|
      4|'proforma invoice'|
      5|'advance invoice'|
      6|'advance credit note'|
      7|'simplified'
  SubDocumentType?: string;
  SubDocumentTypeOrigin?: string;
  TargetConsolidator?: string;
  ClientOnTargetConsolidator?: string;
  ClientBankAccount?: string;
  ID?: string|number;
  ID36?: string|number;
  UUID?: string;
  EgovFlag?: boolean;
  ISDS_ID?: string;
  FileReference?: string;
  ReferenceNumber?: string;
  EgovClassifiers?: any;
  IssuingSystem?: string;
  IssueDate?: string | Date;
  TaxPointDate?: string | Date;
  VATApplicable?: string | boolean;
  ElectronicPossibilityAgreementReference?: string;
  Note?: string;
  LocalCurrencyCode?: string;
  ForeignCurrencyCode?: string;
  CurrRate?: number | string;
  RefCurrRate?: number | string;
  Extensions?: any;
  AccountingSupplierParty?: AccountingSupplierParty;
  SellerSupplierParty?: SellerSupplierParty;
  AnonymousCustomerParty?: any;
  AccountingCustomerParty?: AccountingCustomerParty;
  BuyerCustomerParty?: BuyerCustomerParty;
  OrderReferences?: any;
  OriginalDocumentReferences?: any;
  ContractReferences?: any;
  Delivery?: Delivery;
  DeliveryNoteReferences?: DeliveryNoteReferences;
  InvoiceLines?: InvoiceLines;
  NonTaxedDeposits?: any;
  TaxedDeposits?: any;
  TaxTotal?: TaxTotal;
  LegalMonetaryTotal?: LegalMonetaryTotal;
  PaymentMeans?: PaymentMeans;
  SupplementsList?: any;
}

export interface AccountingCustomerParty {
  Party ?:   Party
}

export interface AccountingSupplierParty {
  Party :   Party
}

export interface SellerSupplierParty {
  Party :   Party
}

export interface BuyerCustomerParty {
  Party :   Party
}


export interface Delivery {
  Party :   Party
}

export interface Party {
  PartyIdentification :      PartyIdentification
  PartyName :                PartyName
  PostalAddress :            PostalAddress
  PartyTaxScheme ?:          PartyTaxScheme
  Contact ?:                 FluffyContact
}

export interface PartyIdentification {
  UserID ?:                         string
  CatalogFirmIdentification ?:      string
  ID ?:                             string
}

export interface PartyName {
  Name :   string
}

export interface PartyTaxScheme {
  CompanyID :   string
  TaxScheme :   string
}

export interface PostalAddress {
  StreetName ?:        string
  BuildingNumber ?:    string
  CityName ?:          string
  PostalZone ?:        string
  Country ?:           Country
}

export interface Country {
  IdentificationCode ?:      string
  Name ?:                    string
}

export interface FluffyContact {
  Name ?:             string
  Telephone ?:        string
  ElectronicMail ?:   string
}

export interface DeliveryNoteReferences {
  DeliveryNoteReference :   DeliveryNoteReferencesDeliveryNoteReference
}

export interface DeliveryNoteReferencesDeliveryNoteReference {
  ID ?:          string|number
  IssueDate ?:   string|Date
  $_id ?:        string|number
}

export interface InvoiceLines {
  InvoiceLine ?:   InvoiceLine[]
}

export interface InvoiceLine {
  ID :                                    string|number
  InvoicedQuantity :                      number|InvoicedQuantity
  LineExtensionAmount :                   string|number
  LineExtensionAmountCurr ?:              string|number
  LineExtensionAmountTaxInclusive :       string|number
  LineExtensionTaxAmount :                string|number
  UnitPrice :                             string|number
  UnitPriceTaxInclusive :                 string|number
  ClassifiedTaxCategory :                 ClassifiedTaxCategory
  Note ?:                                 string
  VATNote ?:                              string
  Item ?:                                 Item
  DeliveryNoteReference ?:                InvoiceLineDeliveryNoteReference
}

export interface ClassifiedTaxCategory {
  Percent :                 string|number
  VATCalculationMethod :    string|number
  VATApplicable :           string|boolean
}

export interface InvoiceLineDeliveryNoteReference {
  LineID ?:   string|number
  $_ref ?:    string|number
}

export interface InvoicedQuantity {
  $_unitCode ?:      string
  '#text'  ?:        string|number
}

export interface Item {
  Description :                            string
  CatalogueItemIdentification ?:           ItemIdentification
  SellersItemIdentification ?:             ItemIdentification
  SecondarySellersItemIdentification ?:    ItemIdentification
  TertiarySellersItemIdentification ?:     ItemIdentification
  BuyersItemIdentification ?:              ItemIdentification
}

export interface ItemIdentification {
  ID : string|number
}

export interface LegalMonetaryTotal {
  TaxExclusiveAmount :                    string|number
  TaxInclusiveAmount :                    string|number
  TaxInclusiveAmountCurr ?:               string|number
  AlreadyClaimedTaxExclusiveAmount :      string|number
  AlreadyClaimedTaxInclusiveAmount :      string|number
  AlreadyClaimedTaxInclusiveAmountCurr ?: string|number
  DifferenceTaxExclusiveAmount :          string|number
  DifferenceTaxInclusiveAmount :          string|number
  DifferenceTaxInclusiveAmountCurr ?:     string|number
  PayableRoundingAmount :                 string|number
  PaidDepositsAmount :                    string|number
  PayableAmount :                         string|number
}

export interface PaymentMeans {
  Payment ?:   Payment
}

export interface Payment {
  PaidAmount ?:          string|number
  PaymentMeansCode ?:    string|number
  Details ?:             Details
}

export interface Details {
  PaymentDueDate ?:   Date|string
  ID ?:               string|number
  BankCode ?:         string|number
  Name ?:             string
  IBAN ?:             string
  BIC ?:              string
  VariableSymbol ?:   string|number
  ConstantSymbol ?:   string|number
  SpecificSymbol ?:   string|number
}

export interface TaxTotal {
  TaxSubTotal :     TaxSubTotal
  TaxAmount :       string|number
}

export interface TaxSubTotal {
  TaxableAmount :                        string|number
  TaxAmount :                            string|number
  TaxInclusiveAmount :                   string|number
  AlreadyClaimedTaxableAmount :          string|number
  AlreadyClaimedTaxableAmountCurr ?:     string|number
  AlreadyClaimedTaxAmount :              string|number
  AlreadyClaimedTaxInclusiveAmount :     string|number
  AlreadyClaimedTaxInclusiveAmountCurr ?: string|number
  DifferenceTaxableAmount :              string|number
  DifferenceTaxAmount :                  string|number
  DifferenceTaxInclusiveAmount :         string|number
  DifferenceTaxInclusiveAmountCurr ?:    string|number
  TaxCategory :                          TaxCategory
}

export interface TaxCategory {
  Percent ?:                  string|number
  VATApplicable ?:            string|boolean
  LocalReverseChargeFlag ?:   string|boolean
}
