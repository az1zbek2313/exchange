type Language = {
    code: string,
    name: string
}
type Currency = {
    code: string,
    name: string,
    symbol: string
}

export type qauntProps = {
    name: string,
    code: string,
    capital: string,
    region: string,
    currency: Currency,
    language: Language,
    flag?: string | undefined;
  }
