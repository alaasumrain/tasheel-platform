import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components';
import * as React from 'react';

interface QuoteSentEmailProps {
	orderNumber: string;
	customerName?: string;
	serviceName: string;
	amount: number;
	currency: string;
	paymentLink?: string;
	expiryHours?: number;
	contactEmail: string;
}

export const QuoteSentEmail = ({
	orderNumber,
	customerName = 'there',
	serviceName,
	amount,
	currency,
	paymentLink,
	expiryHours = 48,
	contactEmail,
}: QuoteSentEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>{`Your quote is ready! Amount: ${amount} ${currency}`}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={headerText}>Quote Ready</Heading>
					</Section>

					<Section style={content}>
						<Text style={paragraph}>Hi {customerName},</Text>

						<Text style={paragraph}>
							Great news! We've prepared a quote for your request. Please review the details below.
						</Text>

						<Section style={orderBox}>
							<Text style={orderLabel}>Order Number:</Text>
							<Text style={orderValue}>{orderNumber}</Text>

							<Text style={orderLabel}>Service:</Text>
							<Text style={orderValue}>{serviceName}</Text>

							<Text style={orderLabel}>Quote Amount:</Text>
							<Text style={amountValue}>{amount.toFixed(2)} {currency}</Text>
						</Section>

						{paymentLink && (
							<>
								<Section style={buttonContainer}>
									<Button style={button} href={paymentLink}>
										Pay Now
									</Button>
								</Section>

								<Text style={warningText}>
									⚠️ This quote expires in {expiryHours} hours. Please complete payment before then.
								</Text>
							</>
						)}

						<Text style={footerText}>
							If you have any questions about this quote, feel free to reply to this email or contact us
							at <Link href={`mailto:${contactEmail}`} style={link}>{contactEmail}</Link>
						</Text>
					</Section>

					<Section style={footer}>
						<Text style={footerText}>
							© {new Date().getFullYear()} Tasheel. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default QuoteSentEmail;

// Styles (same as OrderStatusEmail)
const main = {
	backgroundColor: '#f5f5f5',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
	padding: '40px 20px',
};

const container = {
	backgroundColor: '#ffffff',
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
	margin: '0 auto',
	maxWidth: '600px',
	overflow: 'hidden',
};

const header = {
	backgroundColor: 'rgba(14, 33, 160, 1)',
	padding: '30px 40px',
	textAlign: 'center' as const,
};

const headerText = {
	color: '#ffffff',
	fontSize: '24px',
	fontWeight: '600',
	margin: '0',
};

const content = {
	padding: '40px',
};

const paragraph = {
	fontSize: '16px',
	lineHeight: '1.5',
	color: '#333',
	margin: '0 0 20px',
};

const orderBox = {
	backgroundColor: '#f9f9f9',
	borderRadius: '6px',
	margin: '30px 0',
	padding: '20px',
};

const orderLabel = {
	color: '#666',
	fontSize: '14px',
	margin: '8px 0 4px',
};

const orderValue = {
	color: '#333',
	fontSize: '14px',
	fontWeight: '600',
	textAlign: 'right' as const,
	margin: '4px 0 8px',
};

const amountValue = {
	color: 'rgba(14, 33, 160, 1)',
	fontSize: '20px',
	fontWeight: '700',
	textAlign: 'right' as const,
	margin: '4px 0 8px',
};

const buttonContainer = {
	margin: '30px 0',
	textAlign: 'center' as const,
};

const button = {
	backgroundColor: 'rgba(14, 33, 160, 1)',
	borderRadius: '6px',
	color: '#ffffff',
	display: 'inline-block',
	fontSize: '16px',
	fontWeight: '600',
	padding: '14px 32px',
	textDecoration: 'none',
};

const warningText = {
	fontSize: '14px',
	color: '#ff9800',
	margin: '20px 0',
	textAlign: 'center' as const,
	fontWeight: '600',
};

const link = {
	color: 'rgba(14, 33, 160, 1)',
	textDecoration: 'none',
};

const footerText = {
	fontSize: '14px',
	color: '#666',
	margin: '0',
	lineHeight: '1.5',
};

const footer = {
	backgroundColor: '#f9f9f9',
	borderTop: '1px solid #e0e0e0',
	padding: '30px 40px',
	textAlign: 'center' as const,
};

