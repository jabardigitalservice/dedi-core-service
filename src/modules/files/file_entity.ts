export namespace File {
  export interface ResponseUpload {
    data: {
      path: string
      source: string
      original_name: string
    },
    meta: {}
  }

  export interface Struct {
    id?: number
    name: string
    source: string
    created_at?: Date
  }
}
