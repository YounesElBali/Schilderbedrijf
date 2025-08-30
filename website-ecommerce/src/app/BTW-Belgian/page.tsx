export default function BTWBelgian() {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        BTW voor Belgische Klanten
                    </h1>
                    <p className="text-lg text-gray-600">
                        Alles wat je moet weten over BTW-vrijstelling in België
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Overzicht */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-900 mb-4">
                            📋 Overzicht
                        </h2>
                        <p className="text-blue-800 leading-relaxed">
                            Als Belgische zakelijke klant kun je onder bepaalde voorwaarden gebruik maken van BTW-vrijstelling 
                            bij je aankopen. Dit betekent dat je de producten koopt zonder Nederlandse BTW (21%) en de BTW 
                            afhandelt via je eigen Belgische BTW-aangifte.
                        </p>
                    </div>

                    {/* Wanneer krijg je BTW-vrijstelling */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            ✅ Wanneer krijg je BTW-vrijstelling?
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Geldig Belgisch BTW-nummer</p>
                                    <p className="text-gray-600">Je moet een geldig Belgisch BTW-nummer hebben dat begint met "BE" gevolgd door 10 cijfers (bijvoorbeeld: BE0123456789)</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Zakelijke aankoop</p>
                                    <p className="text-gray-600">De aankoop moet plaatsvinden voor zakelijke doeleinden, niet voor persoonlijk gebruik</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">BTW-plichtig in België</p>
                                    <p className="text-gray-600">Je bedrijf moet geregistreerd zijn voor BTW in België</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hoe werkt het */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            🔄 Hoe werkt BTW-vrijstelling?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-red-600 mb-2">❌ Zonder geldig BTW-nummer</h3>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-red-800 mb-2">Productprijs: €100,00</p>
                                    <p className="text-sm text-red-800 mb-2">Nederlandse BTW (21%): €21,00</p>
                                    <p className="font-semibold text-red-800">Totaal: €121,00</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-green-600 mb-2">✅ Met geldig BTW-nummer</h3>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-green-800 mb-2">Productprijs: €100,00</p>
                                    <p className="text-sm text-green-800 mb-2">Nederlandse BTW: €0,00</p>
                                    <p className="font-semibold text-green-800">Totaal: €100,00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BTW-nummer invoeren */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            📝 BTW-nummer correct invoeren
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Correct formaat:</h3>
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                    <code className="text-green-800 font-mono">BE0123456789</code>
                                    <p className="text-sm text-green-700 mt-1">
                                        Begint met "BE" gevolgd door exact 10 cijfers (geen spaties of andere tekens)
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Voorbeelden van incorrecte formaten:</h3>
                                <div className="bg-red-50 border border-red-200 rounded p-3 space-y-1">
                                    <p className="text-red-800 font-mono text-sm">❌ BE 0123 456 789 (spaties)</p>
                                    <p className="text-red-800 font-mono text-sm">❌ BE0123456789B12 (te veel karakters)</p>
                                    <p className="text-red-800 font-mono text-sm">❌ 0123456789 (zonder BE prefix)</p>
                                    <p className="text-red-800 font-mono text-sm">❌ NL123456789B01 (Nederlands BTW-nummer)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Je verplichtingen */}
                    <div className="bg-yellow-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                            ⚠️ Jouw verplichtingen bij BTW-vrijstelling
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <span className="text-yellow-600">•</span>
                                <p className="text-yellow-800">
                                    <strong>Reverse charge BTW:</strong> Je moet zelf de verschuldigde BTW aangeven in je Belgische BTW-aangifte
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-yellow-600">•</span>
                                <p className="text-yellow-800">
                                    <strong>Administratie:</strong> Bewaar alle facturen en documenten voor je BTW-administratie
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-yellow-600">•</span>
                                <p className="text-yellow-800">
                                    <strong>Correcte gegevens:</strong> Zorg dat je BTW-nummer up-to-date en correct is
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Veelgestelde vragen */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            ❓ Veelgestelde vragen
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Kan ik als particulier gebruik maken van BTW-vrijstelling?
                                </h3>
                                <p className="text-gray-600">
                                    Nee, BTW-vrijstelling is alleen mogelijk voor bedrijven die geregistreerd zijn voor BTW in België.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Wat gebeurt er als mijn BTW-nummer onjuist is?
                                </h3>
                                <p className="text-gray-600">
                                    Bij een onjuist BTW-nummer worden automatisch prijzen inclusief Nederlandse BTW (21%) berekend. 
                                    Je kunt je bestelling annuleren en opnieuw plaatsen met het correcte BTW-nummer.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Krijg ik een factuur zonder BTW?
                                </h3>
                                <p className="text-gray-600">
                                    Ja, bij een geldig Belgisch BTW-nummer ontvang je een factuur zonder Nederlandse BTW met de 
                                    vermelding dat de BTW wordt verlegd naar de afnemer (reverse charge).
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Waar vind ik mijn Belgische BTW-nummer?
                                </h3>
                                <p className="text-gray-600">
                                    Je BTW-nummer vind je op je BTW-registratiedocument van de Belgische overheid, op je facturen, 
                                    of kun je opzoeken op de website van de FOD Financiën.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            💬 Nog vragen?
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Heb je nog vragen over BTW-vrijstelling voor Belgische klanten?
                        </p>
                        <a 
                            href="/customer-support" 
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Neem contact op
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}