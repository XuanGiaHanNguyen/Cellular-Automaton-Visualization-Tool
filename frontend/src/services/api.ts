import { API_ENDPOINT } from "../constants/config"

export const uploadImageForPixelation = async (file: File): Promise<Blob> => {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(API_ENDPOINT, {
        method: "POST", 
        body: formData,
    })

    if (!response.ok){
        throw new Error(`Server error: ${response.status}`)
    }
    return await response.blob()
}