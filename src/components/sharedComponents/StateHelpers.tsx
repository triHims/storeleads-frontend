export function setToMutableState(value:any, hook:any, setHook:(arg0:any|any[]|undefined)=>void) {
	if (!value || !setHook)
		return

	if (Array.isArray(hook)) {


		setHook(old => {
			if (old.includes(value)) {
				return old
			}
			return [...old,
				value
			]
		})
	} else if (typeof hook === "object" && typeof value === 'object') {

		setHook(old => {
			return {
				...old,
				...value
			}
		})


	} else {
		console.error("Undefiend Op")
	}

}

export function deleteFromMutableState(value:any[], hook:any, setHook:(arg0:any|any[]|undefined)=>void) {
	if (!value || !setHook)
		return
	if (Array.isArray(hook)) {
		setHook(old => {
			let temp = old.filter(r => r !== value)
			return temp
		})

	} else if (typeof hook === "object" && Array.isArray(value)) {

		setHook(old => {
		  return {...deleteReturnNewObj(old,value)}
		})



	} else {
		console.error("Undefiend Op")
	}


}


export function deleteReturnNewObj(obj:object,keys:string[]){
  for(const val in keys){
    delete obj[val]
  }
  return obj
}

