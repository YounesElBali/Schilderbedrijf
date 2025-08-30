"use client";

export async function confirm(message: string) {
    return window.confirm(message);
};