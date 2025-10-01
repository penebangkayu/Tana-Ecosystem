import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function Modal({ children, isOpen, onClose }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full">
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  )
}
