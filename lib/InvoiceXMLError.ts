export default class InvoiceXMLError extends Error {
  public errors ?: Error[]
  constructor(errors ?: Error[]) {
    super('Invalid Invoice' + (errors?.length ? `: ${errors[0].message}` : ''))
    if (errors)
      this.errors = errors
  }
}
