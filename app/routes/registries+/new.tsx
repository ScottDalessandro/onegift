// app/routes/registries/new.tsx

import { type Route } from './+types/new.ts'
import { RegistryEditor } from './__registry-editor.tsx'

export { action } from './__registry-editor.server.tsx'

export async function loader({}: Route.LoaderArgs) {
	console.log('LOADING')
	return {}
}

export default RegistryEditor
