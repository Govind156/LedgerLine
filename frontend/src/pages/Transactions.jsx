import { useCallback, useEffect, useState } from 'react'
import categoryApi from '../api/categoryApi'
import transactionApi from '../api/transactionApi'
import TransactionForm from '../component/TransactionForm.jsx'
import TransactionList from '../component/TransactionList.jsx'
import Modal from '../component/Modal.jsx'

const PAGE_SIZE = 10

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCategories = useCallback(async () => {
    const data = await categoryApi.getAll()
    setCategories(data)
  }, [])

  const loadTransactions = useCallback(async (pageNum) => {
    setLoading(true)
    setError('')
    try {
      const data = await transactionApi.getAll(pageNum, PAGE_SIZE)
      setTransactions(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Could not load transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadTransactions(page)
  }, [page, loadTransactions])

  const openAddModal = () => {
    setEditingTransaction(null)
    setModalOpen(true)
  }

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTransaction(null)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, payload)
      } else {
        await transactionApi.create(payload)
      }
      closeModal()
      await loadTransactions(page)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this transaction.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (transaction) => {
    if (!window.confirm(`Delete this ${transaction.type.toLowerCase()} of $${transaction.amount}?`)) return
    try {
      await transactionApi.remove(transaction.id)
      await loadTransactions(page)
    } catch (err) {
      setError('Could not delete this transaction.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Every income and expense, in one running ledger.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Add transaction</button>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state"><p>Loading transactions…</p></div>
        ) : (
          <TransactionList transactions={transactions} onEdit={openEditModal} onDelete={handleDelete} />
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="icon-btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button className="icon-btn" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>›</button>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingTransaction ? 'Edit transaction' : 'Add transaction'} onClose={closeModal}>
          <TransactionForm
            categories={categories}
            initialData={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}