// src/components/ProfileHeader.jsx

import React from 'react';
import './ProfileHeader.css';

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M12 20h9M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"/>
    </svg>
);

// 🚨 เพิ่ม props 'showControls' 🚨
const ProfileHeader = ({ name, university, contact, showEdit, onClickEdit, onClickSave, showControls }) => { 
    const isEditing = showEdit; 

    const handleSave = () => {
        alert('Saving changes...'); 
        if (onClickSave) {
            onClickSave(); 
        }
    };

    // -----------------------------
    // Avatar แสดงตัวอักษรตัวแรกของ name
    // -----------------------------
    const renderAvatar = () => {
        const letter = name && name.length > 0 ? name[0].toUpperCase() : "?";
        return (
            <div
                className="profile-image-container"
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#ffffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    color: "black",
                    fontWeight: "bold",
                }}
            >
                {letter}
            </div>
        );
    };

    return (
        <div className="profile-header-bg">
            
            {/* 1. ส่วน Avatar และ ปุ่ม Edit/Save */}
            <div className="avatar-wrapper">
                {renderAvatar()}

                {/* 🚨 ปุ่ม Edit/Save แสดงผลตาม showControls */}
                {showControls && (
                    <div className="control-buttons">
                        {isEditing ? (
                            <button className="header-button save" onClick={handleSave}>
                                Save
                            </button>
                        ) : (
                            <button className="header-button edit" onClick={onClickEdit}>
                                Edit
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            {/* 2. ส่วนข้อมูล Info */}
            <div className="profile-info">
                <h1 className="profile-name">{name}</h1>

                {/* University Field */}
                <div className="profile-field-container">
                    <span className="field-label">University :</span>
                    <input className="profile-field-input" value={university} readOnly={!isEditing} />
                    {showControls && isEditing && <EditIcon />}
                </div>

                {/* Contact Field */}
                <div className="profile-field-container">
                    <span className="field-label">Contact :</span>
                    <input className="profile-field-input" value={contact} readOnly={!isEditing} />
                    {showControls && isEditing && <EditIcon />}
                </div>
                
                {/* Google Drive Field */}
                <div className="profile-field-container">
                    <span className="field-label">Google Drive :</span>
                    <input className="profile-field-input" value="" placeholder="" readOnly={!isEditing} /> 
                    {showControls && isEditing && <EditIcon />}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
