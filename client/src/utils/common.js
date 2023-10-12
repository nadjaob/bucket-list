export function stateValues(fields){
  return fields.reduce((fieldsObj, field) => {
    let name = field.name.toLowerCase().replace(' ', '_')
    name = name[0] + name.substr(1)
    return { ...fieldsObj, [name]: '' }
  }, {})
}

export function fieldValues(fields){
  return fields.map(field => {
    let name = field.name.toLowerCase().replace(' ', '_')
    name = name[0] + name.substr(1)
    return { ...field, variable: name }
  })
}