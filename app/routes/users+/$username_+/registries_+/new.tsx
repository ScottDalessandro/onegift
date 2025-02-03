// app/routes/registries/new.tsx

import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/new.ts'
import { RegistryEditor } from './__registry-editor.tsx'

export { action } from './__registry-editor.server.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	return { userId }
}

export default RegistryEditor
