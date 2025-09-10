import Image from "next/image"

interface LogoProps {
  showText?: boolean
}

export default function Logo({ showText = true }: LogoProps) {
  return (
    <div className="flex items-center space-x-4">
      <Image src="/logos/logo-web.png" alt="Pile Hive" width={48} height={48} />
      {showText && (
        <h1 className="text-xl font-semibold text-gray-900">
          Pile Hive
        </h1>
      )}
    </div>
  )
}
