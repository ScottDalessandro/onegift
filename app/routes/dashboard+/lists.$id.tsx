import { redirect } from 'react-router'

export function loader({ params }: any) {
	return redirect(`/dashboard/lists/${params.id}`)
}

export default function RedirectToNested() {
	return null
}
