"use server"

import { cookies } from "next/headers"
import { complaintsCol, coordinatesCol, usersCol } from "./db";
import { addDoc, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Complaint, User } from "./types";

export async function getCompliants(): Promise<Complaint[]> {
    const q = query(complaintsCol, where("status", "!=", "completed"))

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function verifyComplaint(complaint: Complaint, placename: string): Promise<string> {
    const mcookies = await cookies()
    const username = mcookies.get("username")

    console.log(complaint)
    // console.log

    // Start a batch operation for atomic updates
    const complaintRef = doc(complaintsCol, complaint.id);
    const coordinatesRef = doc(coordinatesCol, placename);

    // Check if placename exists and get last suffix
    const coordinatesDoc = await getDoc(coordinatesRef);
    let newSuffix = 1;
    if (coordinatesDoc.exists()) {
        newSuffix = (coordinatesDoc.data().last_suffix || 0) + 1;
    }
    const newDocName = `${placename}_${newSuffix}`;

    // Update complaint as completed
    await updateDoc(complaintRef, {
        status: 'completed',
        resolved_by: username,
        resolved_at: Date.now(), // Using Date instead of SERVER_TIMESTAMP for client-side
    });

    // Update location
    await setDoc(
        doc(coordinatesCol, newDocName),
        {
            name: newDocName,
            location: `${complaint.latitude},${complaint.longitude}`
        },
        { merge: false }
    );

    // Update the placename document with new suffix
    await setDoc(
        coordinatesRef,
        { last_suffix: newSuffix },
        { merge: true }
    );

    return newDocName
}

export async function removeCompliant(complaint: Complaint) {
    const complaintRef = doc(complaintsCol, complaint.id);

    await deleteDoc(complaintRef)
}

export async function removePothole(placeName: string) {
    const q = query(
        coordinatesCol,
        where('name', '>=', placeName),
        where('name', '<=', placeName + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log(`No locations found for placename prefix: ${placeName}`);
        return 0;
    }

    // Count deleted documents
    let deletedCount = 0;
    
    // Delete all matching documents
    const deletePromises = querySnapshot.docs.map(async (document) => {
        await deleteDoc(document.ref);
        deletedCount++;
    });

    await Promise.all(deletePromises);

    // Delete the placename base document if it exists
    const baseDocRef = doc(coordinatesCol, placeName);
    const baseDoc = await getDoc(baseDocRef);
    if (baseDoc.exists()) {
        await deleteDoc(baseDocRef);
        // deletedCount++;
    }

    return deletedCount
}

export async function authenticate(username: string, password: string) {
    const snapshot = await getDoc(doc(usersCol, username))
    const usrObject = snapshot.data() as User

    const success = usrObject.password == password
    const mcookies = await cookies()
    if (success) 
        mcookies.set("username", username)

    return success
}

export async function logout() {
    const mcookies = await cookies()
    mcookies.delete("username")
}

export async function submitComplaint(complaint: Omit<Complaint, 'status' | 'reported_at'>) {
    await addDoc(complaintsCol, {
        ...complaint,
        status: 'pending',
        reported_at: Date.now()
    })
}