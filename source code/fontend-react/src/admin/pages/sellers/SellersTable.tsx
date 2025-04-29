import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Chip, CircularProgress, FormControl, InputLabel, Menu, MenuItem, Select, styled, TableFooter, TablePagination, TextField } from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellers, selectSellers, updateSellerAccountStatus } from '../../../Redux Toolkit/Seller/sellerSlice';
import { Search } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const accountStatuses = [
    { status: 'PENDING_VERIFICATION', title: 'Pending Verification', color: '#ff9800', description: 'Account is created but not yet verified' },
    { status: 'ACTIVE', title: 'Active', color: '#4caf50', description: 'Account is active and in good standing' },
    { status: 'SUSPENDED', title: 'Suspended', color: '#f44336', description: 'Account is temporarily suspended' },
    { status: 'DEACTIVATED', title: 'Deactivated', color: '#9e9e9e', description: 'Account is deactivated' },
    { status: 'BANNED', title: 'Banned', color: '#d32f2f', description: 'Account is permanently banned' },
    { status: 'CLOSED', title: 'Closed', color: '#616161', description: 'Account is closed' }
];

export default function SellersTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [accountStatus, setAccountStatus] = React.useState("ACTIVE");
    const [searchTerm, setSearchTerm] = React.useState("");
    const { sellers } = useAppSelector(store => store);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(fetchSellers(accountStatus))
    }, [accountStatus, dispatch])

    const handleAccountStatusChange = (event: any) => {
        setAccountStatus(event.target.value as string);
        setPage(0);
    }

    const handleUpdateSellerAccountStatus = (id: number, status: string) => {
        dispatch(updateSellerAccountStatus({ id, status }));
        handleClose(id);
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [anchorEl, setAnchorEl] = React.useState<{ [key: number]: HTMLElement | null }>({});
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, sellerId: any) => {
        setAnchorEl((prev) => ({ ...prev, [sellerId]: event.currentTarget }));
    };
    const handleClose = (sellerId: number) => {
        setAnchorEl((prev) => ({ ...prev, [sellerId]: null }));
    };

    const filteredSellers = sellers.sellers?.filter(seller => 
        seller.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.mobile.includes(searchTerm) ||
        seller.businessDetails?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>Account Status</InputLabel>
                    <Select
                        value={accountStatus}
                        onChange={handleAccountStatusChange}
                        label="Account Status"
                    >
                        {accountStatuses.map((status) =>
                            <MenuItem key={status.status} value={status.status}>{status.title}</MenuItem>)}
                    </Select>
                </FormControl>

                <TextField
                    sx={{ width: 300 }}
                    label="Search sellers"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: <Search />
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Seller Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Mobile</StyledTableCell>
                            <StyledTableCell>GSTIN</StyledTableCell>
                            <StyledTableCell>Business Name</StyledTableCell>
                            <StyledTableCell align="right">Account Status</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sellers.loading ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : filteredSellers?.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center">
                                    No sellers found
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : (
                            (rowsPerPage > 0
                                ? filteredSellers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredSellers
                            )?.map((seller) => (
                                <StyledTableRow key={seller.id}>
                                    <StyledTableCell>{seller.sellerName}</StyledTableCell>
                                    <StyledTableCell>{seller.email}</StyledTableCell>
                                    <StyledTableCell>{seller.mobile}</StyledTableCell>
                                    <StyledTableCell>{seller.gstin}</StyledTableCell>
                                    <StyledTableCell>{seller.businessDetails?.businessName}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Chip 
                                            label={accountStatuses.find(status => status.status === seller.accountStatus)?.title || seller.accountStatus}
                                            sx={{ 
                                                bgcolor: accountStatuses.find(status => status.status === seller.accountStatus)?.color,
                                                color: 'white'
                                            }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={(e) => handleClick(e, seller.id)}
                                        >
                                            Change Status
                                        </Button>
                                        <Menu
                                            id={"status-menu-" + seller.id}
                                            anchorEl={anchorEl[seller.id || 1]}
                                            open={Boolean(anchorEl[seller.id || 1])}
                                            onClose={() => handleClose(seller.id || 1)}
                                        >
                                            {accountStatuses.map((status) => (
                                                <MenuItem 
                                                    key={status.status}
                                                    onClick={() => handleUpdateSellerAccountStatus(seller.id || 1, status.status)}
                                                    sx={{ 
                                                        color: status.color,
                                                        fontWeight: seller.accountStatus === status.status ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {status.title}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={7}
                                count={filteredSellers?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}
