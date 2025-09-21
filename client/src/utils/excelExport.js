import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
    try {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Write the file
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        
        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        return false;
    }
};

/**
 * Export users data to Excel with custom formatting
 * @param {Array} users - Array of user objects
 * @param {string} filename - Name of the file
 */
export const exportUsersToExcel = (users, filename = 'users_export') => {
    const formattedData = users.map(user => ({
        'الاسم': user.name,
        'البريد الإلكتروني': user.email,
        'رقم الهاتف': user.phone || 'N/A',
        'الجامعة': user.university,
        'المحافظة': user.governorate,
        'الرقم القومي': user.nationalId || 'N/A',
        'الدور': user.role,
        'الوظيفة': user.position?.name || 'N/A',
        'رقم العضوية': user.membershipNumber || 'N/A',
        'تاريخ انتهاء العضوية': user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString('ar-EG') : 'N/A',
        'تاريخ الانضمام': new Date(user.createdAt).toLocaleDateString('ar-EG')
    }));
    
    return exportToExcel(formattedData, filename, 'المستخدمين');
};

/**
 * Export event registered users to Excel
 * @param {Array} users - Array of registered user objects
 * @param {string} eventTitle - Title of the event
 */
export const exportEventUsersToExcel = (users, eventTitle) => {
    const formattedData = users.map(user => ({
        'الاسم': user.name,
        'البريد الإلكتروني': user.email,
        'رقم الهاتف': user.phone || 'N/A',
        'الجامعة': user.university,
        'المحافظة': user.governorate,
        'الرقم القومي': user.nationalId || 'N/A',
        'الوظيفة': user.position?.name || 'N/A',
        'تاريخ التسجيل': new Date(user.createdAt).toLocaleDateString('ar-EG')
    }));
    
    const filename = `${eventTitle.replace(/[^\w\s]/gi, '')}_registered_users`;
    return exportToExcel(formattedData, filename, 'المسجلين في الفعالية');
};