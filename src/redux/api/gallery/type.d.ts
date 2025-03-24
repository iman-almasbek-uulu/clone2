namespace GALLERY {
    export type GalleryResponse = {
        id: number
        gallery_name: string
        gallery_image: string
        address: string
        avg_rating: number
        rating_count: number
    }[]

    export type GalleryRequest = void
}

export { GALLERY };