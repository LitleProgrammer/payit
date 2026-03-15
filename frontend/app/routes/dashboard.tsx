import React from 'react'
import ProtectedRoute from '~/components/ui/ProtectedRoute'

export default function dashboard() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Only logged in users can see this text here</h1>
            </div>
        </ProtectedRoute>
    )
}