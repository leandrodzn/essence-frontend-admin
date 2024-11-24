interface DateTimeOptions {
  date: string | number | Date
}

const getDateTime = (date: DateTimeOptions['date']): string => {
  const currentDate = new Date(date)

  const day = currentDate.getDate()
  const month = currentDate.toLocaleString('es-ES', { month: 'long' })
  const year = currentDate.getFullYear()

  let hours = currentDate.getHours()
  const minutes = ('0' + currentDate.getMinutes()).slice(-2)
  //   const seconds = ('0' + currentDate.getSeconds()).slice(-2)

  const ampm = hours >= 12 ? 'p.m.' : 'a.m.'
  hours = hours % 12
  hours = hours ? hours : 12

  const formatDateTime = `${day} de ${month} de ${year} a las ${hours}:${minutes} ${ampm}`
  return formatDateTime
}

export default getDateTime
