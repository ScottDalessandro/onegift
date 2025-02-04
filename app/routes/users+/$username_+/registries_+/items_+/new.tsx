import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/new.ts'
import ItemEditor from './__item-editor'

export { action } from './__item-editor.server.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	return { userId }
}

export default ItemEditor
