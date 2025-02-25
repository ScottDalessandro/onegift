// app/routes/registries/new.tsx

import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/new.ts'
import { ListEditor } from './__list-editor.tsx'

export { action } from './__list-editor.server.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	return { userId }
}

export default ListEditor
