export function setToMutableArrayState(value, hook, setHook) {
	if (!value || !setHook)
		return

	if (hook.includes(value)) {
		return
	}

	setHook(old => {
		return [...old,
			value
		]
	})

}

export function deleteFromMutableArrayState(value, hook, setHook) {
	if (!value || !setHook)
		return

	if (!hook.includes(value)) {
		return
	}

	setHook(old => {
		let temp = old.filter(r => r !== value)
		return [...temp]
	})
}
