import NextCase from "@/components/NextCase"

// Every case page ends with the next case and a contact button
export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NextCase />
    </>
  )
}
