
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Download, Plus, Trash2, Pencil } from 'lucide-react'
import LeadMagnetForm from '../components/LeadMagnetForm'

interface LeadMagnet {
  id: string
  title: string
  description: string
  downloadUrl: string
  downloads: number
  createdAt: string
}

const LeadMagnets = () => {
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLeadMagnet, setEditingLeadMagnet] = useState<LeadMagnet | null>(null)

  useEffect(() => {
    const fetchLeadMagnets = async () => {
      try {
        const { data } = await axios.get('/api/lead-magnets')
        setLeadMagnets(data)
      } catch (error) {
        console.error('Failed to fetch lead magnets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeadMagnets()
  }, [])

  const handleAddLeadMagnet = async (leadMagnet: Omit<LeadMagnet, 'id' | 'downloads' | 'createdAt'>) => {
    try {
      const { data } = await axios.post('/api/lead-magnets', leadMagnet)
      setLeadMagnets([...leadMagnets, data])
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to add lead magnet:', error)
    }
  }

  const handleUpdateLeadMagnet = async (updatedLeadMagnet: LeadMagnet) => {
    try {
      const { data } = await axios.put(`/api/lead-magnets/${updatedLeadMagnet.id}`, updatedLeadMagnet)
      setLeadMagnets(leadMagnets.map(lm => lm.id === data.id ? data : lm))
      setEditingLeadMagnet(null)
    } catch (error) {
      console.error('Failed to update lead magnet:', error)
    }
  }

  const handleDeleteLeadMagnet = async (id: string) => {
    try {
      await axios.delete(`/api/lead-magnets/${id}`)
      setLeadMagnets(leadMagnets.filter(lm => lm.id !== id))
    } catch (error) {
      console.error('Failed to delete lead magnet:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Magnets</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Offer valuable content to grow your audience
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLeadMagnet(null)
            setIsFormOpen(true)
          }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Lead Magnet
        </button>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-dark-800">
        <div className="px-4 py-5 sm:p-6">
          {leadMagnets.length === 0 ? (
            <div className="text-center">
              <Download className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No lead magnets yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by adding your first lead magnet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Lead Magnet
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-dark-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Downloads
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Created
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-800 dark:divide-dark-700">
                  {leadMagnets.map((leadMagnet) => (
                    <tr key={leadMagnet.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {leadMagnet.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {leadMagnet.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Download className="w-4 h-4 mr-1" />
                          {leadMagnet.downloads}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(leadMagnet.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingLeadMagnet(leadMagnet)}
                          className="p-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 dark:text-gray-400"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLeadMagnet(leadMagnet.id)}
                          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 dark:text-gray-400"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {(isFormOpen || editingLeadMagnet) && (
        <LeadMagnetForm
          leadMagnet={editingLeadMagnet}
          onClose={() => {
            setIsFormOpen(false)
            setEditingLeadMagnet(null)
          }}
          onSubmit={editingLeadMagnet ? handleUpdateLeadMagnet : handleAddLeadMagnet}
        />
      )}
    </div>
  )
}

export default LeadMagnets
  