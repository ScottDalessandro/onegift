// app/routes/resources.unfurl.tsx
import ogs from 'open-graph-scraper'
import { type ActionFunctionArgs } from 'react-router'

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const url = formData.get('url')

	if (!url || typeof url !== 'string') {
		return Response.json({ error: 'URL is required' }, { status: 400 })
	}

	try {
		const { result } = await ogs({
			url,
			fetchOptions: {
				headers: {
					'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
				},
			},
		})
		const metadata = {
			title: result.ogTitle || result.twitterTitle || '',
			description: result.ogDescription || result.twitterDescription || '',
			image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || '',
			price:
				result.jsonLD?.[0] &&
				typeof result.jsonLD[0] === 'object' &&
				'offers' in result.jsonLD[0]
					? (result.jsonLD[0] as { offers: { lowPrice: string } }).offers
							.lowPrice || ''
					: '', // todo: this was a quick type fix, need to double check this
		}
		return Response.json({ metadata })
	} catch (error) {
		console.error('Error unfurling URL:', error)
		console.log('Error:', error)
		return Response.json({ error: 'Failed to unfurl URL' }, { status: 500 })
	}
}
