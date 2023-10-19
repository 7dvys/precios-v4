import { cookies } from "next/headers"

async function getData() {
  const res = await fetch('https://api.sampleapis.com/coffee/hot')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
 
export default async function Page() {
  const data = await getData()
  console.log(cookies().get('accountType'))
 
  return <main>{data[0].title}</main>
}