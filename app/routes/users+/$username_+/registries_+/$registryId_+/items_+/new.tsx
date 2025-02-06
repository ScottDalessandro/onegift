import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/new.ts'
import { ItemEditor } from './__item-editor.tsx'

// The action from __item-editor.server.tsx should run when posting to this route
// Let's verify the action is being exported and imported correctly
export { action } from './__item-editor.server.tsx'

// export async function action({ request }: Route.ActionArgs) {
// 	console.log('RUNNING ADD ITEM ACTION!')
// 	const formData = await request.formData()
// 	console.log('formData', formData)
// }

export async function loader({ request }: Route.LoaderArgs) {
	console.log('RUNNING ADD ITEM LOADER!')
	const userId = await requireUserId(request)
	return { userId }
}

export default ItemEditor
