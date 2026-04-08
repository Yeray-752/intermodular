import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos profesionales
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: 2, borderColor: '#0056b3', paddingBottom: 10 },
  companyInfo: { flexDirection: 'column' },
  companyName: { fontSize: 40, fontWeight: 800, color: '#FF6900' },
  invoiceTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'right' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 20, marginBottom: 5, backgroundColor: '#f0f0f0', padding: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableHeader: { flexDirection: 'row', borderBottom: 1, borderColor: '#000', backgroundColor: '#e4e4e4', fontWeight: 'bold', padding: 5 },
  tableRow: { flexDirection: 'row', borderBottom: 0.5, borderColor: '#ccc', padding: 5 },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalsArea: { marginTop: 30, alignItems: 'flex-end' },
  totalBox: { width: 150, borderTop: 1, paddingTop: 5 },
  grandTotal: { fontSize: 14, fontWeight: 'bold', color: '#0056b3', marginTop: 5 }
});

const InvoicePDF = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const igic = subtotal * 0.07;
  const total = subtotal + igic;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>AKOTAN</Text>
            <Text>Calle Taller, 123, 35600 Puerto del Rosario, España</Text>
            <Text>35600 Puerto del Rosario | CIF: B12345678</Text>
            <Text>Tel: 912 345 678</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURA</Text>
            <Text style={{ textAlign: 'right' }}>Nº: PRE-2026-{data.id}</Text>
            <Text style={{ textAlign: 'right' }}>Fecha: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Información Cliente y Vehículo */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>CLIENTE</Text>
            <Text>{data.clientName}</Text>
            <Text>{data.clientDni}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={styles.sectionTitle}>VEHÍCULO</Text>
            <Text>Modelo: {data.carModel}</Text>
            <Text>Matrícula: {data.plate}</Text>
          </View>
        </View>

        {/* Tabla de Servicios */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Servicio</Text>  
            <Text style={styles.colPrice}>Precio</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.desc}</Text>
              <Text style={styles.colPrice}>{item.price.toFixed(2)}€</Text>
              <Text style={styles.colTotal}>{(item.qty * item.price).toFixed(2)}€</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsArea}>
          <View style={styles.totalBox}>
            <View style={styles.row}>
              <Text>Subtotal:</Text>
              <Text>{subtotal.toFixed(2)}€</Text>
            </View>
            <View style={styles.row}>
              <Text>IGIC (7%):</Text>
              <Text>{igic.toFixed(2)}€</Text>
            </View>
            <View style={[styles.row, styles.grandTotal]}>
              <Text>TOTAL:</Text>
              <Text>{total.toFixed(2)}€</Text>
            </View>
          </View>
        </View>

        {/* Nota Legal */}
        <Text style={{ marginTop: 50, fontSize: 8, color: '#777', textAlign: 'center' }}>
          Este presupuesto tiene una validez de 15 días. Según la ley vigente, las reparaciones tienen una garantía de 3 meses o 2.000 km.
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;