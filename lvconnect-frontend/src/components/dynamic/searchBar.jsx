
import { CiSearch } from "react-icons/ci"

export default function SearchBar({ value, onChange }) {

    return (
        <div className="relative w-full sm:w-96 mx-auto transition-all duration-200 ease-in-out">
                <CiSearch
                className="absolute left-3 top-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
                size={20}
            />
            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 shadow-sm hover:shadow transition-all duration-200 bg-white/90 backdrop-blur-sm"
      
            />
            </div>
    )
}

