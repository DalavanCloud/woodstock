/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */

/*
 * TableRowGroupDesignState.java
 * Created on April 29, 2005, 12:40 PM
 * Version 1.0
 */

package com.sun.webui.jsf.component.table;

import com.sun.data.provider.FieldKey;
import com.sun.data.provider.TableDataProvider;
import com.sun.rave.designtime.DesignBean;
import com.sun.rave.designtime.DesignContext;
import com.sun.rave.designtime.DesignProject;
import com.sun.rave.designtime.DesignProperty;
import com.sun.rave.designtime.Position;
import com.sun.rave.designtime.faces.FacesDesignContext;
import com.sun.rave.designtime.faces.FacesDesignProject;
import com.sun.webui.jsf.component.Checkbox;
import com.sun.webui.jsf.component.TableColumn;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import org.openide.ErrorManager;

/**
 * This class defines the design time state of the Table Group Component
 *
 * @author Winston Prakash
 */
public class TableRowGroupDesignState {
    
    private static final String MODEL_INSTANCE_NAME_SUFFIX =  "DefaultModel"; //NOI18N
    
    private static final String SOURCE_DATA_PROPERTY = "sourceData";
    private static final String SOURCE_VARIABLE_PROPERTY = "sourceVar";
    private static final String ROWS_PROPERTY = "rows";
    private static final String EMPTY_DATA_MSG_PROPERTY = "emptyDataMsg";
    private static final String PAGINATED_PROPERTY = "paginated";
    
    private DesignBean tableRowGroupBean = null;
    private DesignBean sourceBean = null;
    
    FacesDesignContext fcontext = null;
    
    public static final String sourceVarNameBase = "currentRow"; //NOI18N
    private String sourceVarName = sourceVarNameBase;
    
    private Map selectedColumnsDesignStates = new HashMap();
    
    private Vector selectedColumnNames = new Vector();
    private Vector availableColumnNames = new Vector();
    
    private DesignBean dataProviderBean = null;
    
    private int paginationRows = 10;
    private String emptyDataMsg = null;
    
    private boolean childBeansDeleted = false;
    private boolean rowGroupPaginated = false;
    
    private boolean dataProviderReset = false;
    
    private static int varCount = 0;
    
    private List sourceVariableList = new ArrayList();
    
    /** Creates a new instance of TableDesignState */
    public TableRowGroupDesignState(DesignBean tblGrpBean) {
        tableRowGroupBean = tblGrpBean;
        fcontext = (FacesDesignContext) tableRowGroupBean.getDesignContext();
    }
    
    /**
     * Set the selected column names
     */
    public void setSelectedColumnNames(Vector selectedColNames){
        selectedColumnNames =  selectedColNames;
    }
    
    /**
     * Get the selected column names
     */
    public Vector getSelectedColumnNames(){
        return selectedColumnNames;
    }
    
    /**
     * Set the available column names
     */
    public void setAvailableColumnNames(Vector availColNames){
        availableColumnNames =  availColNames;
    }
    
    /**
     * Get the available column names
     */
    public Vector getAvailableColumnNames(){
        return availableColumnNames;
    }
    
    /**
     * Set the Table column design states
     */
    public void setColumnDesignStates(Map colDesignStates){
        selectedColumnsDesignStates =  colDesignStates;
    }
    
    /**
     * Get the Table column design states
     */
    public Map getColumnDesignStates(){
        return selectedColumnsDesignStates;
    }
    
    /**
     * Get the associated Data Model Bean
     */
    public DesignBean getDataProviderBean(){
        return dataProviderBean;
    }
    
    /**
     * Set the Data model DesignBeean to this design state
     */
    public void setDataProviderBean(DesignBean modelBean){
        setDataProviderBean(modelBean, true);
    }
    
    /**
     * Set the Data model DesignBeean to this design state
     * Force the selected columns names with all columns from the Data model
     */
    public void setDataProviderBean(DesignBean modelBean, boolean resetColumns){
        if(!(modelBean.getInstance()  instanceof TableDataProvider)){
            throw new IllegalArgumentException(dataProviderBean.getInstanceName() + " not a table data provider.");
        }
        
        if(modelBean != dataProviderBean){
            // OK new Table Data Provider is added. Remove all old columns
            DesignBean[] children = tableRowGroupBean.getChildBeans();
            for(int i=0; i< children.length; i++){
                fcontext.deleteBean(children[i]);
            }
            childBeansDeleted = true;
        }else{
            childBeansDeleted = false;
        }
        
        dataProviderBean = modelBean;
        
        if(resetColumns){
            resetTableColumns(dataProviderBean);
        }
    }
    
    public void loadState() {
        
        // Load the model bean.
        dataProviderBean = loadModelBean();
        
        if(!dataProviderReset){
            Map dpFields = new HashMap();
            TableDataProvider tdp = (TableDataProvider) dataProviderBean.getInstance();
            try{
                FieldKey[] columns = tdp.getFieldKeys();
                if((columns != null) && (columns.length > 0)){
                    for (int i=0; i< columns.length; i++){
                        //Skip FieldKey of type "Class" - 6309491
                        if(tdp.getType(columns[i]).toString().indexOf("java.lang.Class") == -1){
                            dpFields.put(columns[i].getDisplayName(), columns[i]);
                        }
                    }
                }
            }catch(Exception exc){
                ErrorManager.getDefault().notify(exc);
            }
            loadSourceVariable();
            // Load the child state from the TableColumn
            int childCount = tableRowGroupBean.getChildBeanCount();
            for(int i=0; i< childCount; i++){
                DesignBean tblColumndBean = tableRowGroupBean.getChildBean(i);
                if (tblColumndBean.getInstance() instanceof TableColumn){
                    TableColumnDesignState tblColDesignState = new TableColumnDesignState(tblColumndBean);
                    tblColDesignState.loadState();
                    // If the Column has been removed from the CachedRowsetDataProvider change designstates name to
                    // TableColumnBean instance name and the data binding too and set the child type as Static Text
                    // Reset only if the Table Column is bound to this Table Data Provider
                    /*if(!dpFields.contains(tblColDesignState.getName()) &&
                            (tblColDesignState.getValueExpression().indexOf(sourceVarName) != -1)){
                        tblColDesignState.setName(tblColumndBean.getInstanceName());
                        tblColDesignState.setHeader(tblColumndBean.getInstanceName());
                        tblColDesignState.setType(StaticText.class);
                        tblColDesignState.setValueExpression(ResourceBundle.getBundle("com/sun/webui/jsf/component/table/Bundle").getString("STATIC_TEXT_LBL"));
                    }*/
                    if(dpFields.keySet().contains(tblColDesignState.getName())){
                        FieldKey column =  (FieldKey) dpFields.get(tblColDesignState.getName());
                        tblColDesignState.setColumnType(tdp.getType(column));
                    }
                    selectedColumnsDesignStates.put(tblColDesignState.getName(), tblColDesignState);
                    selectedColumnNames.add(tblColDesignState.getName());
                }
            }
        }
        
        paginationRows = getIntegerPropertyValue(ROWS_PROPERTY);
        if(paginationRows == 0) paginationRows = 10;
        emptyDataMsg = getStringPropertyValue(EMPTY_DATA_MSG_PROPERTY);
    }
    
    /**
     * Load the source variable. Even the Row Group gets new Data Provider
     * the old source variable name should be preserved
     */
    public void loadSourceVariable(){
        sourceVarName = getStringPropertyValue(SOURCE_VARIABLE_PROPERTY);
    }
    
    // For performance improvement. No need to get all the contexts in the project
    // Bug Fix: 6422729 
    private DesignContext[] getDesignContexts(DesignBean designBean){
        DesignProject designProject = designBean.getDesignContext().getProject();
        DesignContext[] contexts;
        if (designProject instanceof FacesDesignProject) {
            contexts = ((FacesDesignProject)designProject).findDesignContexts(new String[] {
                "request",
                "session",
                "application"
            });
        } else {
            contexts = new DesignContext[0];
        }
        DesignContext[] designContexts = new DesignContext[contexts.length + 1];
        designContexts[0] = designBean.getDesignContext();
        System.arraycopy(contexts, 0, designContexts, 1, contexts.length);
        return designContexts;
    }
    
    /**
     * Load the model bean from the TableRowGroup bean from the source data tag.
     * If not found create or get the default model bean from the context
     */
    private DesignBean loadModelBean(){
        DesignBean modelBean = null;
        String sourceDataStr = getPropertyValueSource(SOURCE_DATA_PROPERTY);
        if(sourceDataStr != null) {
            //DesignContext[] contexts = fcontext.getProject().getDesignContexts();
            DesignContext[] contexts = getDesignContexts(tableRowGroupBean);
            for (int i = 0; i < contexts.length; i++) {
                DesignBean[] modelBeans = contexts[i].getBeansOfType(TableDataProvider.class);
                for(int j=0; j< modelBeans.length; j++){
                    String modelBindingExpr = ((FacesDesignContext)contexts[i]).getBindingExpr(modelBeans[j]);
                    if(sourceDataStr.startsWith(modelBindingExpr)){
                        modelBean = modelBeans[j];
                        break;
                    }
                }
            }
        }
        // XXX - What should we do if the user deleteds the source data?
        if(modelBean == null){
            modelBean = TableDesignHelper.createDefaultDataProvider(tableRowGroupBean.getBeanParent());
            resetTableColumns(modelBean);
            dataProviderReset = true;
        }
        return modelBean;
    }
    
    private void resetTableColumns(DesignBean dataProviderBean){
        // Set the selected column names from the default data model
        TableDataProvider tdp = (TableDataProvider) dataProviderBean.getInstance();
        FieldKey[] columns = tdp.getFieldKeys();
        if((columns != null) && (columns.length > 0)){
            for (int i=0; i< columns.length; i++){
                selectedColumnNames.add(columns[i].getDisplayName());
                TableColumnDesignState tblColDesignState = new TableColumnDesignState(columns[i].getDisplayName());
                tblColDesignState.setColumnType(tdp.getType(columns[i]));
                if (tdp.getType(columns[i]).isAssignableFrom(Boolean.class)){
                    tblColDesignState.setChildType(Checkbox.class);
                }
                selectedColumnsDesignStates.put(tblColDesignState.getName(), tblColDesignState);
            }
        }
    }
    
    /**
     * Clear all the property values set to this state
     */
    public void clearProperties(){
        paginationRows = 5;
    }
    
    /**
     * Get the boolean value of the property
     */
    public boolean getBooleanPropertyValue(String propertyname){
        boolean value = false;
        Object propValue = getPropertyValue(propertyname);
        if(propValue != null){
            value = ((Boolean) propValue).booleanValue();
        }
        return value;
    }
    
    /**
     * Get String property value
     */
    private String getStringPropertyValue(String propertyname){
        Object value = getPropertyValue(propertyname);
        if(value != null){
            return value.toString();
        }else{
            return null;
        }
    }
    
    /**
     * Get int property value
     */
    private int getIntegerPropertyValue(String propertyname){
        Object value = getPropertyValue(propertyname);
        if(value != null){
            return ((Integer)value).intValue();
        }else{
            return -1;
        }
    }
    
    /**
     * Load the property value from the bean to this state
     */
    private Object getPropertyValue(String propertyname){
        Object propertyValue = null;
        DesignProperty designProperty = tableRowGroupBean.getProperty(propertyname);
        if(designProperty != null){
            if(designProperty.getValue() != null){
                propertyValue = designProperty.getValue();
            }
        }
        return propertyValue;
    }
    
    /**
     * Get the property value source from the bean to this state
     */
    private String getPropertyValueSource(String propertyname){
        String propertyValue = null;
        DesignProperty designProperty = tableRowGroupBean.getProperty(propertyname);
        if(designProperty != null){
            propertyValue = designProperty.getValueSource();
        }
        return propertyValue;
    }
    
    /**
     * Set the value to the bean property as stored in this state
     */
    private void setPropertyValue(String propertyname, Object value){
        if(value != null){
            DesignProperty designProperty = tableRowGroupBean.getProperty(propertyname);
            if(designProperty != null){
                Object origValue = getPropertyValue(propertyname);
                if(value != origValue){
                    if((value instanceof String) && value.toString().equals("")){
                        designProperty.unset();
                    }else{
                        designProperty.setValue(value);
                    }
                }
            }
        }
    }
    
    
    /**
     * Set a boolean value to the property
     */
    private void setBooleanPropertyValue(String propertyname, boolean value){
        DesignProperty designProperty = tableRowGroupBean.getProperty(propertyname);
        if(designProperty != null){
            boolean origValue = getBooleanPropertyValue(propertyname);
            if(origValue != value){
                if(value){
                    designProperty.setValue(new Boolean(true));
                }else{
                    designProperty.unset();
                }
            }
        }
    }
    
    /**
     * Set the empty data  message
     */
    public void setEmptyDataMsg(String msg){
        emptyDataMsg = msg;
    }
    
    /**
     * Get the empty data  message
     */
    public String getEmptyDataMsg(){
        return emptyDataMsg;
    }
    
    /**
     * Set the paginated property to the table row group
     */
    public void setPaginated(boolean paginated){
        rowGroupPaginated = paginated;
    }
    
    /**
     * Get the paginated property to the table row group
     */
    public boolean getPaginated(){
        return rowGroupPaginated;
    }
    
    /**
     * Set the no of rows used to paginate the table row group
     */
    public void setRows(int rows){
        paginationRows = rows;
    }
    
    /**
     * Get the no of rows used to paginate the table row group
     */
    public int getRows(){
        return paginationRows;
    }
    
    /*public int getColumnWidth(int colNo){
        String colName = (String) selectedColumnNames.get(colNo);
        TableColumnDesignState columnsDesignState = (TableColumnDesignState) selectedColumnsDesignStates.get(colName);
        return columnsDesignState.getWidth();
    }
     
    public void setColumnWidth(int colNo, int colWidth){
        setColumnWidth(colNo, colWidth, false);
    }
     
    public void setColumnWidth(int colNo, int colWidth, boolean immediat){
        String colName = (String) selectedColumnNames.get(colNo);
        TableColumnDesignState columnsDesignState = (TableColumnDesignState) selectedColumnsDesignStates.get(colName);
        columnsDesignState.setWidth(colWidth, immediat);
    }*/
    
    /**
     * Save the design state of the TableRowGroup component
     */
    public void saveState() {
        
        if (selectedColumnNames.size() > 0){
            String defDataBindingExpr = ((FacesDesignContext)dataProviderBean.getDesignContext()).getBindingExpr(dataProviderBean);
            setPropertyValue(SOURCE_DATA_PROPERTY, defDataBindingExpr);
            setPropertyValue(EMPTY_DATA_MSG_PROPERTY, emptyDataMsg);
            setBooleanPropertyValue(PAGINATED_PROPERTY, rowGroupPaginated);
            
            if(sourceVarName == null){
                sourceVarName = sourceVarNameBase;
            }
            
            setPropertyValue(SOURCE_VARIABLE_PROPERTY, sourceVarName);
            
            try{
                setPropertyValue(ROWS_PROPERTY, new Integer(paginationRows));
            }catch(Exception exc){
                exc.printStackTrace();
            }
        }else{
            setPropertyValue(SOURCE_DATA_PROPERTY, "");
            setPropertyValue(SOURCE_VARIABLE_PROPERTY, "");
        }
        
        if(dataProviderReset){
            // OK new Table Data Provider is reset. Remove all old columns
            DesignBean[] children = tableRowGroupBean.getChildBeans();
            for(int i=0; i< children.length; i++){
                fcontext.deleteBean(children[i]);
            }
            childBeansDeleted = true;
        }
        
        
        // Persist the design states of the selected Table Column.
        // Create the table column bean if not created already.
        for (int i=0; i< selectedColumnNames.size(); i++){
            // Create the Table Columns, set it to the TableColumnDesignState and save its state
            TableColumnDesignState tblColDesignState = (TableColumnDesignState) selectedColumnsDesignStates.get(selectedColumnNames.get(i));
            if((tblColDesignState.getTableColumnBean() == null) || childBeansDeleted){
                DesignBean tableColumnBean = fcontext.createBean(TableColumn.class.getName(), tableRowGroupBean, null);
                tblColDesignState.setTableColumnBean(tableColumnBean);
            }
            tblColDesignState.setSourceVariable(sourceVarName);
            tblColDesignState.saveState();
            fcontext.moveBean(tblColDesignState.getTableColumnBean(), tableRowGroupBean, new Position(i));
        }
        
        // Remove only the tabel column design bean. Do not yet
        // remove the Table Column design states. User must not
        // have closed the customizer only pressed apply button.
        for (int i=0; i< availableColumnNames.size(); i++){
            TableColumnDesignState tblColDesignState = (TableColumnDesignState) selectedColumnsDesignStates.get(availableColumnNames.get(i));
            if(tblColDesignState.getTableColumnBean() != null){
                fcontext.deleteBean(tblColDesignState.getTableColumnBean());
                tblColDesignState.setTableColumnBean(null);
            }
        }
        
        if(childBeansDeleted) TableDesignHelper.adjustTableWidth(tableRowGroupBean);
        
        childBeansDeleted = false;
        
        if(!TableDesignHelper.isDefaultDataProvider(tableRowGroupBean.getBeanParent(), dataProviderBean)){
            TableDesignHelper.deleteDefaultDataProvider(tableRowGroupBean.getBeanParent());
        }
    }
}
