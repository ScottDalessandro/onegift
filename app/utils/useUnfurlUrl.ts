import { type FormMetadata, type FieldMetadata } from '@conform-to/react'
import { type ListItemImage } from '@prisma/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
import { type z } from 'zod'
import { type ListItemSchema } from '#app/routes/lists+/$listId_+/items_+/__item-editor.tsx'

type ListItem = z.infer<typeof ListItemSchema>

interface UnfurlFields {
  form: FormMetadata<ListItem>
  url: FieldMetadata<string | undefined>
  name: FieldMetadata<string>
  description: FieldMetadata<string | undefined>
  price: FieldMetadata<number>
  images: FieldMetadata<ListItemImage[] | undefined>
}
  
export function useUrlUnfurl({form}: UnfurlFields) {
  const fetcher = useFetcher()
  const lastUrlRef = useRef<string | undefined>(undefined)
  const updatedRef = useRef(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const handleUrlPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {   
      e.preventDefault()
      const url = e.clipboardData.getData('text')
      if (!url || !url.startsWith('http')) return
      
      // Reset the update flag when new URL is pasted
      updatedRef.current = false
      lastUrlRef.current = url
      
      void fetcher.submit(
        { url },
        { 
          method: 'POST',
          action: '/resources/unfurl',
        }
      )
    },
    [fetcher]
  )

  useEffect(() => {
    if (fetcher.data?.metadata && fetcher.state === 'idle' && !updatedRef.current) {
      const { metadata } = fetcher.data
      
      try {
        updatedRef.current = true
        
        if (metadata.description) {      
          form.update({ name: 'description', value: metadata.description })
        }
        if (metadata.title) {
          form.update({ name: 'name', value: metadata.title })
        }
        
        if (metadata.price) {
          const parsedPrice = parseFloat(metadata.price.replace(/[^0-9.]/g, '')).toString()
          form.update({ name: 'price', value: parsedPrice })
        }

        if (metadata.image) {
          form.update({ name: 'images', value: [{ objectKey: metadata.image }] })
          setPreviewImage(metadata.image)
        }

        if (lastUrlRef.current) {
          console.log('Updating url:' + lastUrlRef.current)
          form.update({ name: 'url', value: lastUrlRef.current, validated: true })
        }

      } catch (error) {
        console.error('Error updating form:', error);
      }
    }
  }, [fetcher.data, fetcher.state, form])
  
  return {
    handleUrlPaste,
    isUnfurling: fetcher.state !== 'idle',
    error: fetcher.data?.error,
    previewImage,
  }
}
