import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center space-x-4">
      <Image src="/logos/logo-web.png" alt="Pile Hive" width={48} height={48} />
      <h1 className="text-xl font-semibold text-gray-900">
        Pile Hive
      </h1>
    </div>
  )
}
